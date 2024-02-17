import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { SuperAdminGuard } from './core/auth/guards/superAdmin.guard';
import { SchoolAdminGuard } from './core/auth/guards/school-admin.guard';
import { RequiredPermissionComponent } from './modules/required-permission/required-permission.component';

// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'users' },

    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'users' },

    // Auth routes for guests
    {
        path: '',

        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [

            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) },
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule) },
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            // { path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule) },
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            { path: 'users', loadChildren: () => import('app/modules/admin/admins/admins.module').then(m => m.AdminsModule), canActivateChild: [SuperAdminGuard], canActivate: [SuperAdminGuard] },
            { path: 'schools', loadChildren: () => import('app/modules/admin/schools/schools.module').then(m => m.SchoolsModule), canActivateChild: [SchoolAdminGuard], canActivate: [SchoolAdminGuard] },
            { path: 'loans', loadChildren: () => import('app/modules/admin/loans/loans.module').then(m => m.LoansModule), canActivateChild: [SuperAdminGuard], canActivate: [SuperAdminGuard] }
            , { path: 'required-permission', component: RequiredPermissionComponent }

        ]
    },
];
