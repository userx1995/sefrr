import { Directive, ElementRef, Input } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { Role } from 'app/core/enums/role.enum';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[secure]'
})
export class SecureDirective {

    @Input() role = '';
    authSubscription!: Subscription;
    constructor(private elementRef: ElementRef, private authServie: AuthService) { }

    ngOnInit() {
        this.authSubscription = this.authServie.getUserRole().subscribe(res => {

            var roles = localStorage.getItem('role').split(',') || [];
            const superRole = roles.find(item => item === 'super_admin' || item === 'operation_manager' || item === 'school_admin');
            const isSuperAdmin = superRole == Role.superAdmin || superRole == Role.operationManager || superRole == Role.school_admin ? true : false;
            if (isSuperAdmin === true) {
                if (this.role == Role.admin) {
                    this.isAllow(false);
                } else {
                    this.isAllow(true);
                }
            } else if (isSuperAdmin === false) {
                if (this.role == 'admin') {
                    this.isAllow(true);
                } else {
                    this.isAllow(false);
                }
            }
        });

    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.authSubscription.unsubscribe();
    }

    isAllow(allow: boolean) {
        const el: HTMLElement = this.elementRef.nativeElement;

        if (!allow) {
            el.remove();
        }
    }
}
