import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { Footer } from '../footer/footer';
import { Rightsidebarbar } from '../rightsidebarbar/rightsidebarbar';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet,Header,Sidebar,Footer,Rightsidebarbar],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {}
