import { Component, OnInit, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { days } from 'app/core/enums/days.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { sharedService } from 'app/core/services/shared.service';
import { HttpService } from 'app/core/services/http.service';
@Component({
    selector: 'app-working-hours',
    templateUrl: './working-hours.component.html'
})
export class WorkingHoursComponent implements OnInit {
    @Output() obj = new EventEmitter();
    workingHour: FormGroup;
    isUpdateWorkingHours: boolean = false;
    isAdd: boolean = false;
    get days() {
        return this.workingHour.get('working_hours') as FormArray;
    }
    schedule(dayIndex) {
        return this.days.at(dayIndex).get('schedule') as FormArray;
    }

    constructor(
        private _matDialogRef: MatDialogRef<WorkingHoursComponent>,
        private fb: FormBuilder,
        private shared: sharedService,
        private _snackBar: MatSnackBar,
        private http: HttpService,
        @Inject(MAT_DIALOG_DATA) public commigData: any
    ) { }

    ngOnInit(): void {
        this.buildForm();
        console.log('commigData', this.commigData);
        this.isAdd = this.commigData.isAdd;
        if (this.commigData.updateWorkingHours == true) {
            this.updateWorkingHours();
            this.isUpdateWorkingHours = true;
        }

    }
    buildForm() {
        this.workingHour = this.fb.group({
            working_hours: this.fb.array([
                this.fb.group({
                    day: days.Saturday,
                    schedule: this.fb.array([])
                }),
                this.fb.group({
                    day: days.Sunday,
                    schedule: this.fb.array([])
                }),
                this.fb.group({
                    day: days.Monday,
                    schedule: this.fb.array([])
                }),
                this.fb.group({
                    day: days.Tuesday,
                    schedule: this.fb.array([])
                }),
                this.fb.group({
                    day: days.Wednesday,
                    schedule: this.fb.array([])
                }),
                this.fb.group({
                    day: days.Thursday,
                    schedule: this.fb.array([])
                }),
                this.fb.group({
                    day: days.Friday,
                    schedule: this.fb.array([])
                })
            ])
        });

    }
    updateWorkingHours() {
        this.shared.workingHour$.subscribe((res: any) => {
            res.working_hours.forEach(el => {
                this.days.controls.forEach((day, i) => {
                    if (day.get('day').value == el.day) {
                        el.schedule.forEach((schedule) => {
                            this.schedule(i).push(
                                this.fb.group({
                                    from: [schedule.from, Validators.required],
                                    to: [schedule.to, Validators.required]
                                })
                            );
                        });
                    }
                });
            });
        });
    }

    addFromToGroup(dayIndex) {
        this.schedule(dayIndex).push(
            this.fb.group({
                from: [null, Validators.required],
                to: [null, Validators.required]
            })
        );
    }


    deletFromToGroup(dayIndex, hourIndex) {
        this.schedule(dayIndex).removeAt(hourIndex);
    }

    checkFromTo(dayIndex, hourIndex) {
        this.schedule(dayIndex).controls[hourIndex].value;
        let from = this.convertTimeToNumber(this.schedule(dayIndex).controls[hourIndex].get('from').value);
        let to = this.convertTimeToNumber(this.schedule(dayIndex).controls[hourIndex].get('to').value);
        if (to && to < from) {
            this.schedule(dayIndex).controls[hourIndex].get('to').setValue(null);
            this._snackBar.open('To time must be after From time', 'Close', { duration: 2000 });
        }
    }

    convertTimeToNumber(timeHour) {
        if (timeHour) {
            return timeHour.replace(':', '.');
        } else {
            return null;
        }

    }
    closePopup(): void {
        this._matDialogRef.close();
        this.commigData.updateWorkingHours = false;
        this.isUpdateWorkingHours = false;
    }

    submit() {
        this.obj.emit(this.workingHour.value);
        this.shared.workingHour$.next(this.workingHour.value);
        this._matDialogRef.close();
        this.commigData.updateWorkingHours = false;
        this.isUpdateWorkingHours = false;
    }

    updateGroup(): void {
        const body = {
            ...this.workingHour.value,
            name: this.commigData.chat.name,
            picture: this.commigData.chat.picture,
            last_message: "",
            category: this.commigData.chat.category,
            description: this.commigData.chat.description,
            admins: this.commigData.chat.admins,
            verified_metadata: {
                city: this.commigData.chat.verified_metadata.city,
                phone: this.commigData.chat.verified_metadata.phone,
                address: this.commigData.chat.verified_metadataaddress,
                facebook_url: this.commigData.chat.verified_metadatafacebook_url,
                youtube_url: this.commigData.chat.verified_metadatayoutube_url,
                twitter_url: this.commigData.chat.verified_metadatatwitter_url,
                linkedin_url: this.commigData.chat.verified_metadatalinkedin_url,
                site_url: this.commigData.chat.verified_metadatasite_url,
            }
        };
        this.http.put(`api/conversation/${this.commigData.chat.id}`, body).subscribe(res => {
            this.obj.emit(this.workingHour.value);
            this.shared.workingHour$.next(this.workingHour.value);
            this._matDialogRef.close();
            this.commigData.updateWorkingHours = false;
            this.isUpdateWorkingHours = false;
        });
    }
}
