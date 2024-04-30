export default class FormValidater {
  static IsEmpty(field: string): boolean {
    if (field.trim() === "") {
      return true;
    }
    return false;
  }
}
