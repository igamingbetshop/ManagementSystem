export type FieldConfig = {
  required:boolean;
  mandatory:boolean;
  regExp:string;
}
export type Field = {
  Title:string;
  Type:string;
  Config:FieldConfig
  Order:number;
}
