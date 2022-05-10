export default class filehandler {
    constructor(arg) {
            const { mimeTpes, maxSize } = arg;
            this.fileTypes = new Set(mimeTpes || []);
            this.maxSize = maxSize;
        }
        //* validate file type and size */
    validate(f) {
        const rightType = this.fileTypes.has(f.mimetype);
        let reason = !rightType ? `${f.mimetype} The type is invalid try (doc,docx,pdf)` : '';
        const fit = this.maxSize > f.size;
        console.log(f)
        reason += !fit ? ` The file is too large (${f.size})` : '';
        const valid = rightType && fit;
        return { reason, valid };
    }
}