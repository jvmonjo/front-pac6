import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { User } from 'src/app/profile/models/User';
import { UserType } from 'src/app/profile/models/UserType';

const users = [
  { id: 11, name: 'Josep', surname: 'Monjo', email: 'jvmonjo@gmail.com', password: '12345678', type: UserType.TOURIST },
  { id: 12, name: 'Jesus', surname: 'Sanchez', email: 'example@gmail.com', password: '12345678', type: UserType.TOURIST },
  { id: 13, name: 'Big', surname: 'Enterprise', email: 'admin@enterprise.com', password: '12345678', type: UserType.COMPANY  },
  { id: 14, name: 'Michel', surname: 'Night', email: 'admin@gmail.com', password: '12345678', type: UserType.COMPANY }
]

const activities = [
  {
    id: 1, name: 'Museu Picasso', category: 'Cultura i patrimoni', subcategory: 'Museu', description: 'Visita guiada al museu Picasso. Inclou dinar', price: 15, language: 'ES', minimumCapacity: 5, limitCapacity: 20, userId: 13, date: '2020-10-22'
  },
  {
    id: 2, name: 'Vins i més', category: 'Enoturisme', description: 'Tast de vins de la zona. Es farà una cata a cegues amb cada vi de la selecció.', subcategory: 'Bodega', price: 15, language: 'CA', minimumCapacity: 5, limitCapacity: 20, userId: 14, date: '2020-11-26'
  }
]

const educations = [
  {
    id: 1, type:'Cicle formatiu', level: 'Grau mitjà', name: 'Fusta i moble', university: 'IES Borriana', userId: 11, finishDate: '2020-10-23'
  }
]

const languages = [
  {
    id: 1, level: 'C1', language: 'Anglès', userId: 11, finishDate: '2019-10-04'
  }
]

const my_activities_user = [
  {
    id: 1,
    activityId: 1,
    userId: 11
  },
  {
    id: 2,
    activityId: 2,
    userId: 12
  },
  {
    id: 3,
    activityId: 2,
    userId: 12
  }
]

const favorites_user = [
  {
    id: 1,
    activityId: 2,
    userId: 11
  },
  {
    id: 2,
    activityId: 2,
    userId: 13
  }
]

@Injectable({
  providedIn: 'root'
})

export class InMemoryDataService implements InMemoryDbService {
  createDb()  {
    return { users, activities, educations, languages, my_activities_user, favorites_user }
  }

  genId(users: User[]): number {
    return users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 14;
  }

}
