import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { Role } from 'app/core/enums/role.enum';
import { HttpService } from 'app/core/services/http.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string; } = {
        type: 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private http: HttpService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        // Create the form
        this.signInForm = this._formBuilder.group({
            username: [null, Validators.required],
            password: [null, Validators.required],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    getProfile(id) {
        this.http.getCommunity(`user/${id}/profile`).pipe(
            finalize(() => {
                const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                this._authService.userRole.next(Role.superAdmin);
                console.log('redirectURL', redirectURL);
                // Navigate to the redirect url
                this._router.navigateByUrl(redirectURL);

            })
        ).subscribe({
            next: (res: any) => {
                localStorage.setItem('profile', JSON.stringify(res));
            }
        });
    }


    /**
     * Sign in
     */
    signIn(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in

        const body = {
            username: this.signInForm.value.username,
            password: this.signInForm.value.password
        };
        this._authService.signIn(body).subscribe(
            (_res: any) => {
                this.signInForm.enable();
                const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                // Navigate to the redirect url
                this._router.navigateByUrl(redirectURL);
            },
            () => {
                // Re-enable the form
                this.signInForm.enable();

                // Reset the form
                this.signInNgForm.resetForm();

                // Set the alert
                this.alert = {
                    type: 'error',
                    message: 'Wrong email or password'
                };

                // Show the alert
                this.showAlert = true;
            }
        );
    }
}