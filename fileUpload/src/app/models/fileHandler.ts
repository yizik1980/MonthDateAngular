export interface fileConfig {
  mimeTpes: Array<string>;
  maxSize: number;
}
export class filehandler {
  fileTypes = new Set<string>();
  maxSize = 10000;
  constructor(arg: fileConfig) {
    const { mimeTpes, maxSize } = arg;
    this.fileTypes = new Set(mimeTpes || []);
    this.maxSize = maxSize;
  }
  //* validate file type and size */
  validate(f: File): { reason: string; valid: boolean } {
    const rightType = this.fileTypes.has(f.type);
    let reason = !rightType ? `${f.type} The file is not valid try (doc,docx,jpg,png) \n` : '';
    const fit = this.maxSize > f.size;
    reason += !fit ? ` The file is too large (${f.size}) \n` : '';
    const valid = rightType && fit;
    return { reason, valid };
  }
}
