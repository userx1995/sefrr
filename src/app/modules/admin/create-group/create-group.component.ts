import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Contact } from '../chat/chat.types';
import { FiltersComponent } from './filters/filters.component';
import { WorkingHoursComponent } from './working-hours/working-hours.component';
import { HttpService } from 'app/core/services/http.service';
import { LoadingService } from 'app/core/services/loading.service';
import { sharedService } from 'app/core/services/shared.service';
import { Router } from '@angular/router';

@Component({
    selector: 'create-group',
    templateUrl: './create-group.component.html',
    encapsulation: ViewEncapsulation.None
})
export class CreateGroupComponent implements OnInit {
    @ViewChild('imageFileInput') private _imageFileInput: ElementRef;
    horizontalStepperForm: FormGroup;
    imageUrl: any;
    workingHouresData: any;
    contacts: Contact[] = [];
    selectedModerators = [];
    categories: [] = [];
    validWorkingHours: boolean = false;

    pageNumber: number = 1;
    adminsPagination: any;
    totalPages: number;


    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private http: HttpService,
        private shared: sharedService,
        private loading: LoadingService,
        private router: Router
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.getCategories();
        this.getAdmins();
        const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
        // Horizontal stepper form
        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                picture: [''],
                name: ['', Validators.required],
                description: ['', [Validators.required, Validators.maxLength(300)]],
                category: ['']
            }),
            step2: this._formBuilder.group({
                phone: ['', [Validators.pattern(/^1[0-2,5]{1}[0-9]{8}$/),
                Validators.maxLength(10)]],
                address: ['', Validators.required],
                city: ['', Validators.required],
                hours: [''],
                facebook_url: ['', [Validators.required, Validators.pattern(urlRegex)]],
                twitter_url: ['', [Validators.required, Validators.pattern(urlRegex)]],
                youtube_url: ['', [Validators.required, Validators.pattern(urlRegex)]],
                linkedin_url: ['', [Validators.required, Validators.pattern(urlRegex)]],
                site_url: ['', [Validators.required, Validators.pattern(urlRegex)]]
            }),
            step3: this._formBuilder.group({})
        });
    }
    uploadAvatar(event): void {
        const formData = new FormData();
        this.loading.isLoading.next(true);
        formData.append('file', event.target.files[0]);
        this.http.postFile('upload/file/Image', formData).subscribe((res: any) => {
            this.imageUrl = res.result.file_url;
            this.loading.isLoading.next(false);
        });
    }
    createGroup(): void {
        this.loading.isLoading.next(true);
        const body = {
            ...this.workingHouresData,
            name: this.horizontalStepperForm.controls['step1'].get('name').value,
            picture: this.imageUrl,
            last_message: "",
            category: this.horizontalStepperForm.controls['step1'].get('category').value,
            description: this.horizontalStepperForm.controls['step1'].get('description').value,
            admins: this.selectedModerators,
            verified_metadata: {
                city: this.horizontalStepperForm.controls['step2'].get('city').value,
                phone: "0" + this.horizontalStepperForm.controls['step2'].get('phone').value,
                address: this.horizontalStepperForm.controls['step2'].get('address').value,
                facebook_url: this.horizontalStepperForm.controls['step2'].get('facebook_url').value,
                youtube_url: this.horizontalStepperForm.controls['step2'].get('youtube_url').value,
                twitter_url: this.horizontalStepperForm.controls['step2'].get('twitter_url').value,
                linkedin_url: this.horizontalStepperForm.controls['step2'].get('linkedin_url').value,
                site_url: this.horizontalStepperForm.controls['step2'].get('site_url').value,
            }
        };
        this.http.post('api/conversation', body).subscribe(res => {
            this.loading.isLoading.next(false);
            this.router.navigate(['/chat']);
        });
    }

    removeAvatar(): void {
        this.imageUrl = null;
    }
    openFilters(): void {
        this._matDialog.open(FiltersComponent, {
            autoFocus: false,
            data: {
                note: {}
            }
        });
    }
    /**
     * Filter the chats
     *
    * @param query
    */
    searchValue;
    filterLetter(query: string): void {
        this.searchValue = query;
        // Reset the filter
        // if (!query) {
        //     if (query == "") {
        //         this.getAdmins();
        //     }
        //     else {
        //         return;
        //     }
        // }
        // if (query.match(/\d/)) {
        //     this.contacts = this.contacts.filter((contact: any) => contact.phone_number.includes(query));
        // }
        // else {
        //     this.contacts = this.contacts.filter((contact: any) => contact.username.toLowerCase().includes(query.toLowerCase()));
        // }
        if (query == '') {
            this.getAdmins();
        }
        else {
            this.http.get('api/admin/all?page=' + this.pageNumber + '&limit=5' + '&search=' + query).subscribe((res: any) => {
                this.contacts = res.admins;
                this.adminsPagination = res.pagination;
                this.totalPages = Math.ceil(this.adminsPagination.total / 5);
            });
        }

    }

    openWorkingHours(): void {
        this.validWorkingHours = false;
        const confirmation = this._matDialog.open(WorkingHoursComponent, {
            autoFocus: false,
            disableClose: true,
            width: '1180px',
            data: {
                note: {},
                isAdd: true,
                updateWorkingHours: this.workingHouresData ? true : false
            }
        });
        confirmation.afterClosed().subscribe((result) => {
            this.shared.workingHour$.subscribe(res => {
                this.workingHouresData = res;
                this.workingHouresData.working_hours.forEach(element => {
                    if (element.schedule.length > 0) {
                        this.validWorkingHours = true;
                    }
                });
            });
        });
    }

    getAdmins(): void {
        this.http.get('api/admin/all?page=' + this.pageNumber + '&limit=5' + '&search').subscribe((res: any) => {
            this.contacts = res.admins;
            this.adminsPagination = res.pagination;
            this.totalPages = Math.ceil(this.adminsPagination.total / 5);
        });
    }
    getNextAdmins(): void {
        ++this.pageNumber;
        if (this.pageNumber <= this.adminsPagination.total) {
            if (this.searchValue.length > 0) {
                this.filterLetter(this.searchValue);
            } else {
                this.getAdmins();
            }
        }
    }
    getPrevAdmins(): void {
        --this.pageNumber;
        if (this.pageNumber <= this.adminsPagination.total) {
            if (this.searchValue.length > 0) {
                this.filterLetter(this.searchValue);
            } else {
                this.getAdmins();
            }
        }
    }

    getCategories(): void {
        this.http.get('api/data/categories').subscribe((res: any) => {
            this.categories = res.categories;
        });
    }

    checkboxChanged(event) {
        const id = { "id": +event.source.id }; //Get the id of the checkbox
        if (event.checked) {
            this.selectedModerators.push(id); //If checked, add to array
        }
        else {
            //if unchecked, remove from the array
            const i = this.selectedModerators.indexOf(id);
            this.selectedModerators.splice(i, 1);
        }
        //console.log("tempData", this.selectedModerators); // prinst [B, C] from the example of the screenshot
    }

    omit_special_char(e) {
        // var k;
        // k = event.charCode;
        // return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
        var regex = new RegExp("^[a-zA-Z0-9-\u0621-\u064A\u0660-\u0669 ]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        }
        e.preventDefault();
        return false;
    }

}
