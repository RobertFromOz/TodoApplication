import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class ToDoService {

    baseUrl = 'http://localhost:5120/todo';

    constructor(private http: HttpClient) { }

    getAll(): Observable<any[]> {
        return this.http.get<any[]>(this.baseUrl);
    }

    get(id : number): Observable<Todo> {
        return this.http.get<Todo>(`${this.baseUrl}/${id}`);
    }

    add(data: Todo): Observable<any> {
        return this.http.post(`${this.baseUrl}`, data);
    }

    update(id: number, newState: boolean): Observable<any> {
        return this.http.put(`${this.baseUrl}/${id}`, newState);
    }
    
    delete(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }    
}

export interface Todo
{
    id: number;
    task: String;
    deadline: Date;
    completed: boolean;
    details: String;
    parentId: number;
}
