import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SecureDirective } from './directives/secure/secure.directive';

@NgModule({
    declarations: [
        SecureDirective,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        SecureDirective,
        ReactiveFormsModule
    ]
})
export class SharedModule {
}
