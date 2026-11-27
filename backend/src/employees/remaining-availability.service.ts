import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, type EntityManager } from 'typeorm';
import {
  addHours, decimalFromNumber, decimalText, parsePositiveSupport, subtractHours,
} from './decimal-hours.js';

export type Capacity = {
  weekStart: string;
  declaredHoursExact: string | null;
  allocatedHoursExact: string;
  remainingHoursExact: string | null;
  status: 'MISSING' | 'AVAILABLE' | 'EXHAUSTED' | 'OVER_ALLOCATED';
};

type CapacityRow = { id: string; declaredWeek: string | null; declaredHours: number | null; hours: string | null };

export function readCapacity(weekStart: string, declaredWeek: string | null, hours: number | null, allocations: string[]): Capacity {
  let total = decimalFromNumber(0);
  for (const value of allocations) {
    const amount = parsePositiveSupport(value);
    if (!amount) throw new Error('Invalid committed allocation amount.');
    total = addHours(total, amount);
  }
  const allocatedHoursExact = decimalText(total);
  if (declaredWeek !== weekStart || hours == null) {
    return { weekStart, declaredHoursExact: null, allocatedHoursExact, remainingHoursExact: null, status: 'MISSING' };
  }
  const declared = decimalFromNumber(hours);
  const remaining = subtractHours(declared, total);
  return {
    weekStart, declaredHoursExact: decimalText(declared), allocatedHoursExact,
    remainingHoursExact: decimalText(remaining),
    status: remaining.coefficient < 0n ? 'OVER_ALLOCATED' : remaining.coefficient === 0n ? 'EXHAUSTED' : 'AVAILABLE',
  };
}

@Injectable()
export class RemainingAvailabilityService {
  constructor(@InjectDataSource() private readonly database: DataSource) {}

  async forEmployees(ids: readonly string[], weekStart: string, manager = this.database.manager) {
    if (ids.length === 0) return new Map<string, Capacity>();
    const rows = await manager.query(
      `SELECT e.id, DATE_FORMAT(e.availabilityWeekStart, '%Y-%m-%d') AS declaredWeek,
        e.availableHours AS declaredHours, a.hoursExact AS hours
      FROM employees e LEFT JOIN project_allocations a ON a.employeeId = e.id AND a.weekStart = ?
      WHERE e.id IN (?)`, [weekStart, ids],
    ) as CapacityRow[];
    const entries = new Map<string, { row: CapacityRow; amounts: string[] }>();
    for (const row of rows) {
      let entry = entries.get(row.id);
      if (!entry) {
        entry = { row, amounts: [] };
        entries.set(row.id, entry);
      }
      if (row.hours !== null) entry.amounts.push(row.hours);
    }
    return new Map([...entries].map(([id, { row, amounts }]) => [
      id, readCapacity(weekStart, row.declaredWeek, row.declaredHours, amounts),
    ]));
  }

  async forEmployee(id: string, weekStart: string, manager?: EntityManager) {
    return (await this.forEmployees([id], weekStart, manager)).get(id);
  }
}
