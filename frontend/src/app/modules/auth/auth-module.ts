import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing-module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyCodeComponent } from './verify-code/verify-code.component';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, ForgotPasswordComponent, VerifyCodeComponent],
  imports: [CommonModule, AuthRoutingModule, FormsModule, ReactiveFormsModule]
})
export class AuthModule {}
