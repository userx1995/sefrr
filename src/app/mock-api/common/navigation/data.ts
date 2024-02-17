/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';
import { Role } from 'app/core/enums/role.enum';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'users',
        title: 'Users',
        type: 'collapsable',
        icon: 'heroicons_outline:user-group',
        isSecure: true,
        children: [
            {
                id: 'users',
                title: 'Users',
                type: 'basic',
                link: '/users'
            }
        ],

    },
    // {
    //     id: 'groups',
    //     title: 'Groups',
    //     type: 'basic',
    //     icon: 'heroicons_outline:chat-alt',
    //     link: '/chat',
    //     isSecure: false
    // },
    // {
    //     id: 'new-group',
    //     title: 'Add New Group',
    //     type: 'basic',
    //     icon: 'mat_outline:add_circle_outline',
    //     link: '/create-group',
    //     isSecure: true,
    // },
    // {
    //     id: 'school-requestes',
    //     title: 'School Requests',
    //     type: 'basic',
    //     icon: 'mat_outline:article',
    //     link: '/school-requestes',
    //     isSecure: true,
    // },
    {
        id: 'schools-list',
        title: 'Schools',
        type: 'basic',
        icon: 'mat_outline:school',
        link: '/schools',
        isSecure: true,
    },
    {
        id: 'loans-list',
        title: 'Loans',
        type: 'basic',
        icon: 'mat_outline:credit_score',
        link: '/loans',
        isSecure: true,
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
