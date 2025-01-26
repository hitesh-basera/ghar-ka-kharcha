import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS,Validator, FormControl } from '@angular/forms';
function usernameValidator(control: FormControl): { [key: string]: any } | null {
  const usernameRegex = /^[a-zA-Z0-9]{3,}$/; // Matches 3 or more alphanumeric characters
  return (usernameRegex.test(control.value)) ? null : { 'invalidUsername': true };
}
@Directive({
  selector: '[appUsernameValidator]',
  standalone: true,
  providers:[{ provide: NG_VALIDATORS, useValue: usernameValidator, multi: true }]
})
export class UsernameValidatorDirective implements Validator {
  @Input() userName!: boolean; 
  validate(control: FormControl): { [key: string]: any } | null {
    return usernameValidator(control);
  }

}
