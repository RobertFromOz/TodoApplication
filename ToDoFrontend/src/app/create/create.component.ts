import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { ToDoService } from '../../ToDoService.service';

@Component({
    selector: 'app-todo',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet, 
        RouterModule,
        ReactiveFormsModule
    ],
    templateUrl: './create.component.html',
    styleUrl: './create.component.sass'
})

export class CreateComponent
{ 
    userForm: FormGroup;
    parentError: boolean = false;
    
    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private toDoService: ToDoService, 
        private router: Router,) { }

    ngOnInit(): void {
        let parentId = this.route.snapshot.params['parentId']
        if (parentId) {
            this.CheckParent(parentId)
        }

        this.userForm = this.formBuilder.group({
            task: new FormControl('', Validators.required),
            deadline: new FormControl('', Validators.required),
            details: new FormControl(''),
            parentId: new FormControl(this.route.snapshot.params['parentId']),
        });
    }

    onSubmit() {
        this.toDoService.add(this.userForm.value).subscribe({
            next: () => {
                this.router.navigate(['/list']);
            },
            error: () => alert('Failed saving new Todo.')
        });
    }

    CheckParent(id : number) {
        this.toDoService.get(id).subscribe({
            next: (data) => {
                if (data.parentId) {
                    alert('Parent todo already has parent.')
                    this.parentError = true
                }
            },
            error: () => alert('Failed getting parent todo.')
        });
    }
}
