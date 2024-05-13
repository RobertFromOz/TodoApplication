import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ToDoService, Todo } from '../../ToDoService.service';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet, 
        RouterModule
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.sass'
})

export class ListComponent 
{ 

    title = 'ToDoFrontend';
    todoList: Todo[] = [];
    
    constructor(private toDoService: ToDoService) { }

    ngOnInit() {
        this.getAll()
    }

    checkDate(date: Date) : boolean {        
        let now = new Date();
        now.setHours(0, 0, 0, 0);        
        if (date >= now) {
            return false; 
        } 
        return true; 
    }

    parentIdThenIdComparator(a: Todo, b: Todo): number {
        if (a.parentId === null && b.parentId !== null) {
            return b.id - b.parentId;
        } else if (a.parentId !== null && b.parentId === null) {
            return a.parentId - b.id;
        } else if (a.parentId !== null && b.parentId !== null && a.parentId != b.parentId) {
            return a.parentId - b.parentId;
        }
        return a.id - b.id;
    }

    getAll() {
        this.toDoService.getAll().subscribe({
            next: (data) => {
                data.forEach(x => x.deadline = new Date(x.deadline))
                this.todoList = data.sort(this.parentIdThenIdComparator);;
            },
            error: () => alert('Failed getting todo list.')
        });
    }

    delete(id : number) {
        this.toDoService.delete(id).subscribe({
            next: () => {
                this.todoList = this.todoList?.filter(x => x.id != id)
                this.todoList = this.todoList?.filter(x => x.parentId != id)
            },
            error: () => alert('Failed deleting todo.')
        });
    }

    updateComplete(id: number, newState: boolean) {
        this.toDoService.update(id, newState).subscribe({
            next: () => {},
            error: () => alert('Failed updating status.')
        });
    }
    
    statusChange(id : number) {
        var toUpdate = this.todoList[this.todoList.findIndex( x => x.id == id)]
        toUpdate.completed = !toUpdate.completed;
        this.updateComplete(id, toUpdate.completed);

        if(toUpdate.completed)
            {
            if (toUpdate.parentId) {
                this.UpdateSiblings(toUpdate);
            } else {
                this.UpdateParent(toUpdate);
            }
        }       
    }


    UpdateParent(toUpdate : Todo) {
        var children = this.todoList.filter(x => x.parentId == toUpdate.id);
        children.forEach(child => {
            if (!child.completed) {
                child.completed = true;
            }
        });
    }

    UpdateSiblings(toUpdate : Todo) {
        var parent = this.todoList.filter(x => x.id == toUpdate.parentId)[0];
        var siblings = this.todoList.filter(x => x.parentId == parent.id && x.parentId != toUpdate.id);
        var updateParent = true;
        siblings.forEach(x => {
            if (!x.completed) {
                updateParent = false;
            }
        });

        if (updateParent) {
            if (!parent.completed) {
                parent.completed = true;
            }
        }
    }
}
