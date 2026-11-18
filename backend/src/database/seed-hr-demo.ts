import { EmployeeSkill } from '../employee-skills/employee-skill.entity.js';
import { getAvailabilityWeek } from '../employees/availability-week.js';
import { Employee } from '../employees/employee.entity.js';
import { Skill } from '../skills/skill.entity.js';
import dataSource from './data-source.js';

const demoSkills = [
  { id: 'be776a62-7c4d-4e97-88aa-000000000001', name: 'TypeScript' },
  { id: 'be776a62-7c4d-4e97-88aa-000000000002', name: 'MySQL' },
  { id: 'be776a62-7c4d-4e97-88aa-000000000003', name: 'Kiểm thử phần mềm' },
];

const demoEmployees = [
  { suffix: '01', name: 'An Mây', skills: [0, 1], hours: 12.5 },
  { suffix: '02', name: 'Bình Sương', skills: [0], hours: 4 },
  { suffix: '03', name: 'Chi Nắng', skills: [1], hours: 0 },
  { suffix: '04', name: 'Dương Gió', skills: [2], hours: null },
  {
    suffix: '05',
    name: 'Giang Mưa',
    skills: [0, 2],
    hours: 8,
    previousWeek: true,
  },
];

if (dataSource.options.database !== 'rms_ai_pm_dev') {
  throw new Error('Seed HR demo chỉ chạy trên database rms_ai_pm_dev.');
}

const { weekStart } = getAvailabilityWeek();
const previousMonday = new Date(`${weekStart}T00:00:00Z`);
previousMonday.setUTCDate(previousMonday.getUTCDate() - 7);
const previousWeekStart = previousMonday.toISOString().slice(0, 10);

await dataSource.initialize();
try {
  const counts = await dataSource.transaction(async (manager) => {
    const employees = manager.getRepository(Employee);
    const skills = manager.getRepository(Skill);
    const links = manager.getRepository(EmployeeSkill);
    const counts = { employees: 0, skills: 0, links: 0 };
    const pending = [];

    for (const demo of demoEmployees) {
      const id = `2e0f7db7-c2cb-412c-8acf-0000000000${demo.suffix}`;
      if (!(await employees.existsBy({ id }))) pending.push({ ...demo, id });
    }
    if (pending.length === 0) return counts;

    const skillIds: string[] = [];
    for (const skill of demoSkills) {
      const existing = await skills.findOne({
        where: { name: skill.name },
        order: { id: 'ASC' },
      });
      if (!existing) {
        await skills.insert(skill);
        counts.skills++;
      }
      skillIds.push(existing?.id ?? skill.id);
    }

    for (const demo of pending) {
      await employees.insert({
        id: demo.id,
        displayName: `[Demo HR] ${demo.name}`,
        availableHours: demo.hours,
        availabilityWeekStart:
          demo.hours === null
            ? null
            : demo.previousWeek
              ? previousWeekStart
              : weekStart,
      });
      counts.employees++;
      const employeeSkills = demo.skills.map((index) => ({
        employeeId: demo.id,
        skillId: skillIds[index],
      }));
      await links.insert(employeeSkills);
      counts.links += employeeSkills.length;
    }
    return counts;
  });
  console.log(
    JSON.stringify({ weekStart, previousWeekStart, inserted: counts }),
  );
} finally {
  await dataSource.destroy();
}
