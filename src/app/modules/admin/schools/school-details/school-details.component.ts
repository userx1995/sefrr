import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SchoolsService } from '../schools.service';
import { Lookups, School, SchoolPayload } from '../schools.types';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-school-details',
  templateUrl: './school-details.component.html',
  styleUrls: ['./school-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchoolDetailsComponent implements OnInit {
  @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;

  school: School;
  schoolForm: FormGroup;
  isEditMode: Boolean = false;
  schoolId: string;
  cities$: Observable<Lookups[]>
  areas: Lookups[];

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _fb: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    private _schoolsService: SchoolsService) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  httpUrlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', // fragment locator
    'i'
  );
  /**
   * On init
   */
  ngOnInit(): void {
    this.cities$ = this._schoolsService.cities$;

    this.schoolId = this._activatedRoute.snapshot.paramMap.get('id');

    if (!this.schoolId) {
      this.isEditMode = true;
    }

    // Create the school form
    this.schoolForm = this._fb.group({
      name: this._fb.group({
        enName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[A-Za-z0-9\s]+$/)]],
        arName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[\u0600-\u06FF0-9\s]+$/)]],
      }),
      website: ['', [Validators.required, Validators.pattern(this.httpUrlPattern)]],
      students: ['', [Validators.min(1), Validators.pattern(/^\d+$/)]],
      contact: this._fb.group({
        email: ['', Validators.email],
        mobileNo: ['', Validators.pattern(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/)],
        name: ['', [Validators.minLength(2), Validators.maxLength(50), Validators.pattern(/^[A-Za-z\u0600-\u06FF\s]+$/)]],
      }),
      address: this._fb.group({
        cityCode: ['', Validators.required],
        areaCode: ['', Validators.required],
        gov: [''],
        street: [''],
      }),
    });

    if (this.schoolId) {
      // Get the school
      this._schoolsService.school$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((school: School) => {
          // Get the school
          this.school = school;

          // Patch values to the form from the school object
          this.schoolForm.setValue({
            name: school.name,
            website: school.website ?? '',
            contact: {
              email: school.contactPerson?.email ?? '',
              mobileNo: school?.contactPerson?.mobileNo ?? '',
              name: school?.contactPerson?.name ?? '',
            },
            students: school?.totalNoOfStudents ?? '',
            address: {
              cityCode: school?.address?.city?.code ?? '',
              areaCode: school?.address?.area?.code ?? '',
              gov: school?.address?.gov ?? '',
              street: school?.address?.street ?? '',
            }
          }, { emitEvent: false });
          school?.address?.city?.code && this.onCitySelectionChange({ value: school?.address?.city?.code });
          this.schoolForm.disable({ emitEvent: false })
          // Mark for check
          this._changeDetectorRef.markForCheck();
          console.log(this.schoolForm.errors);

        });
    }

  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  /**
   * submit form
   */
  onSubmit() {
    const formVal = this.schoolForm.value;
    const schoolPayload: SchoolPayload = {} as SchoolPayload;

    const { contact, name, address, students, website } = formVal;

    schoolPayload.name = name;
    schoolPayload.website = website
    schoolPayload.totalNoOfStudents = students
    schoolPayload.contactPerson = contact
    schoolPayload.address = address
    if (this.schoolId && this.isEditMode) {
      // call to update school
      this.isEditMode = false;
      this._schoolsService.updateSchool(this.schoolId, schoolPayload).subscribe({
        next: (val) => {
          // TODO: add toastr
          this._schoolsService.getSchoolById(this.schoolId);
          this.schoolForm.disable({ emitEvent: false });
          // Mark for check
          this._changeDetectorRef.markForCheck();
        },
        error: (err) => {
          // TODO: add toastr
          console.log('error:', err);
        }
      })
    } else {
      // call to create school
      this._schoolsService.createSchool(schoolPayload).subscribe({
        next: (val) => {
          // TODO: add toastr
          this._router.navigate(['../'], { relativeTo: this._activatedRoute });
          this.schoolForm.disable({ emitEvent: false });
          // Mark for check
          this._changeDetectorRef.markForCheck();
        },
        error: (err) => {
          // TODO: add toastr
          console.log('error:', err);
        }
      })
    }
  }

  /**
   * Delete the task
   */
  CancelEditSchool(): void {

    if (this.schoolForm.dirty) {
      // Open the confirmation dialog
      const confirmation = this._fuseConfirmationService.open({
        title: `${this.schoolId ? 'Cancel Changes' : 'Cancel Creation'}`,
        message: 'Are you sure you want to cancel your changes? Any unsaved changes will be discarded.',
        actions: {
          confirm: {
            label: 'Confirm'
          },
          cancel: {
            label: 'Discard'
          }
        }
      });

      // Subscribe to the confirmation dialog closed action
      confirmation.afterClosed().subscribe((result) => {

        // If the confirm button pressed...
        if (result === 'confirmed') {
          this._router.navigate(['../'], { relativeTo: this._activatedRoute });
          // Mark for check
          this._changeDetectorRef.markForCheck();
        }
      });
    } else {
      this._router.navigate(['../'], { relativeTo: this._activatedRoute });
      // Mark for check
      this._changeDetectorRef.markForCheck();
    }
  }

  onCitySelectionChange(event: any) {
    const cityCode = event.value;
    this._schoolsService.getAreasByCityCode(cityCode).subscribe({
      next: (res) => { this.areas = res.areas }
    })
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  /**
   * get error messages for website control
   *
   */
  getWebsiteErrorMessage() {
    if (this.websiteControl.hasError('required')) {
      return 'You must enter a value';
    }

    return this.websiteControl.hasError('pattern') ? 'Not a valid URL' : '';
  }

  getNameArErrorMessage() {
    if (this.nameArControl.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.nameArControl.hasError('minlength') || this.nameArControl.hasError('maxlength')) {
      return 'name must be between 2 and 50 characters';
    }

    return this.nameArControl.hasError('pattern') ? 'Not a valid Arabic name' : '';
  }

  getNameEnErrorMessage() {
    if (this.nameEnControl.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.nameEnControl.hasError('minlength') || this.nameEnControl.hasError('maxlength')) {
      return 'name must be between 2 and 50 characters';

    }

    return this.nameEnControl.hasError('pattern') ? 'Not a valid English name' : '';
  }
  getStudentsNumberErrorMessage() {
    if (this.studentsNumberControl.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.studentsNumberControl.hasError('min')) {
      return 'must be greater than 0';
    }

    return this.studentsNumberControl.hasError('pattern') ? 'Must be a whole number' : '';
  }

  getEmailErrorMessage() {
    return this.emailControl.hasError('email') ? 'Must enter a valid mail' : '';
  }
  getPhoneErrorMessage() {
    return this.emailControl.hasError('mobileNo') ? 'Must enter a valid egyptian phone number' : '';
  }
  getNameErrorMessage() {
    if (this.nameControl.hasError('minlength') || this.nameControl.hasError('maxlength')) {
      return 'name must be between 2 and 50 characters';
    }

    return this.nameControl.hasError('pattern') ? 'Not a valid name' : '';

  }

  get websiteControl() {
    return this.schoolForm.get('website');
  }
  get nameArControl() {
    return this.schoolForm.get('name').get('arName');
  }
  get nameEnControl() {
    return this.schoolForm.get('name').get('enName');
  }
  get studentsNumberControl() {
    return this.schoolForm.get('students');
  }
  get emailControl() {
    return this.schoolForm.get('contact').get('email');
  }
  get phoneControl() {
    return this.schoolForm.get('contact').get('mobileNo');
  }
  get nameControl() {
    return this.schoolForm.get('contact').get('name');
  }
  /**
 * get selected City value
 *
 */
  get selectedCityVal(): any {
    return this.schoolForm?.get('cityCode')?.value
  }


  /**
 * Upload avatar
 *
 * @param fileList
 */
  uploadAvatar(fileList: FileList): void {
    // Return if canceled
    if (!fileList.length) {
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png'];
    const file = fileList[0];

    // Return if the file is not allowed
    if (!allowedTypes.includes(file.type)) {
      return;
    }

    // Upload the avatar
    let formData = new FormData();
    formData.append('file', file);

    this._schoolsService.uploadSchoolLogo(formData, this.schoolId).subscribe();
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.schoolForm.enable({ emitEvent: true })
    } else {
      this.schoolForm.disable({ emitEvent: false })
    }
  }
}
