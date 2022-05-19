import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Conge } from 'src/app/agent/congeadministratif/congeadministratif.component';
// import { ListeConges } from 'src/app/agent/mesdemandes/mesdemandes.component';
interface ListeConges {
  id: number;
  nombreDeJours: number;
  dateDemande: Date;
  dateDebut: Date;
  dateFin: Date;
  etat: string;
}
@Component({
  selector: 'app-lesdemandeschef',
  templateUrl: './lesdemandeschef.component.html',
  styleUrls: ['./lesdemandeschef.component.css'],
})
export class LesdemandeschefComponent implements OnInit {
  error: string | undefined;
  success!: string;
  isAccepted!: boolean;
  isRefused!: boolean;
  displayedColumns: string[] = [
    'id',
    'nombreDeJours',
    'dateDemande',
    'dateDebut',
    'dateFin',
    'etat',
    'action',
  ];
  dataSource!: MatTableDataSource<ListeConges>;
  conge;
  i;
  clickedAccept = new Array();
  clickedRefuse = new Array();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private httpClient: HttpClient, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.httpClient
      .get('http://localhost:8080/conges/get')
      .subscribe((response: any) => {
        console.log('response', response);
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(response[0].id);
      });
  }

  applyFilter(conge: any) {
    const filterValue = (conge.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  accept(conge: Conge) {
    // console.log('conge', conge, 'i', i);
    this.httpClient
      .put('http://localhost:8080/conges/accepter', conge)
      .subscribe(
        (result) => {
          this.conge = result;
          this.clickedAccept[conge.id] = true;
          this.clickedRefuse[conge.id] = false;
          this.isAccepted = true;
          this.isRefused = false;
          this.success = "Vous avez refusé l'événement " + conge.id;
          this.ngOnInit();
        },
        (error1) => {
          console.log('error', error1);
          this.error = error1.error.message;
        }
      );
  }

  refuse(conge: Conge) {
    this.httpClient
      .put('http://localhost:8080/conges/refuser', conge)
      .subscribe(
        (result) => {
          this.conge = result;
          this.success = "Vous avez refusé l'événement " + conge.id;
          this.isAccepted = false;
          this.isRefused = true;
          this.clickedRefuse[conge.id] = true;
          this.clickedAccept[conge.id] = false;
          this.ngOnInit();
        },
        (error1) => {
          console.log('error', error1);
          this.error = error1.error.message;
        }
      );
  }
}
