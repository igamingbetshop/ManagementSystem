import { FormControlOptions, ValidatorFn, Validators } from "@angular/forms";
import { Field } from "../models";

export function getValidatorsFromField(field:Field): ValidatorFn | ValidatorFn[] | FormControlOptions | null
{
  const validators = [];
  if(field?.Config?.required || field?.Config?.mandatory)
    validators.push(Validators.required);
  if(field?.Config?.regExp)
    validators.push(Validators.pattern(new RegExp(field.Config.regExp)));
  return validators;
}