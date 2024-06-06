import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { ToDoService, Todo } from '../../ToDoService.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-todo',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet, 
        RouterModule,
        ReactiveFormsModule
    ],
    templateUrl: './view.component.html',
    styleUrl: './view.component.sass'
})

export class ViewComponent
{ 
    isReady: boolean = false;
    viewTodo: Todo;
    
    constructor(
        private route: ActivatedRoute,
        private toDoService: ToDoService,  
    ) { }

    ngOnInit(): void {
        let id = this.route.snapshot.params['id']
        this.get(id)
    }

    get(id : number) {
        this.toDoService.get(id).subscribe({
            next: (data) => {
                this.viewTodo = data
                this.isReady = true
            },
            error: () => alert('Failed getting todo.')
        });
    }
}
