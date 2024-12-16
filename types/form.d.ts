export interface FormResult {
  errors?: { [key?: string]: string } | undefined;
  success?: boolean | undefined;
}
