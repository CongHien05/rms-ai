export class TaskLoadGuard {
  private revision = 0
  private activeUpdates = 0

  beginLoad(): number | null {
    if (this.activeUpdates > 0) return null
    return ++this.revision
  }

  beginUpdate(): void {
    this.revision += 1
    this.activeUpdates += 1
  }

  finishUpdate(): void {
    this.activeUpdates = Math.max(0, this.activeUpdates - 1)
  }

  canApplyLoad(loadRevision: number): boolean {
    return this.activeUpdates === 0 && loadRevision === this.revision
  }
}
