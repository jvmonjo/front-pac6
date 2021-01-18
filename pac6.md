---
title: "PAC6. Refactoring"
author: 'Josep V. Monjo'
date: '11/01/2021'
lang: ca
numbersections: true
# fontfamily: FiraSans
linkcolor: blue
urlcolor: blue
header-includes: |
    \usepackage{fancyhdr}
    \pagestyle{fancy}
    \fancyhf{}
    \rhead{PAC6}
    \lhead{Josep V. Monjo}
    \cfoot{\thepage}
    \usepackage{setspace}
    \doublespacing
---

# Code smells

## Duplicated code

Es tracta de codi que es repeteix al llarg de dos o més parts del nostre codi. El problema és que contribueix a engreixar el nostre _code base_ i el fa més difícil de mantenir.

Exemple:

```js
double(num: number): string {
    const res: number = num * 2;
    return `El nombre seleccionat és ${res}`
}

triple(num: number): string {
    const res: number = num * 3;
    return `El nombre seleccionat és ${res}`
}
```

**Possible solució:** _Extract method_

## Comments

Quan ens veiem obligats a incloure comentaris al nostre codi és possible que el propi codi no estiga prou clar o el nom de la classe o el mètode no inferisca la seua funció i per això necessite el comentari.

Exemple:

```js
// Mètode per duplicar cada ínput

nomQueNoTeResAVeure(input: number): number {
    return input * 2
}
```

**Possible solució:** _Rename method_

## Long method

Es tracta d'un mètode amb massa línies de codi. Això fa el nostre codi més difícil de llegir i el converteix en un _spaghetti code_.

Exemple:

`Si el nostre codi té més de 10 línies és possible que el podam simplificar.`

**Possible solució:** _Extract method_

## Switch statements

Es dóna quan tenim una seqüència massa complexa de _switch_ o de condicionals _if_.

El problema llavors és que si necessitem afegir una condició hem de canviar tot el nostre codi i el fa difícil de mantenir.

Exemple[^1]:

[^1]: Exemple extret de [sourcemaking.com](https://sourcemaking.com/refactoring/replace-conditional-with-polymorphism)

```js
class Bird {
  // ...
  getSpeed(): number {
    switch (type) {
      case EUROPEAN:
        return getBaseSpeed();
      case AFRICAN:
        return getBaseSpeed() - getLoadFactor() * numberOfCoconuts;
      case NORWEGIAN_BLUE:
        return (isNailed) ? 0 : getBaseSpeed(voltage);
    }
    throw new Error("Should be unreachable");
  }
}

```

**Possible solució:** _Replace Conditional with Polymorphism_

## Primitive Obsession

Es tracta de l'abús de primitius per a tasques en les que seria més adient l'ús de classes.

Exemple:

```js
const isAdmin = 1
```

**Possible solució:** _Replace Data Value with Object_

## Long Parameter List

Es tracta d'un mètode amb més de tres o quatre paràmetres. Amb molts paràmetres el codi guanya complexitat i es fa difícil d'entendre.

Exemple[^2]:

[^2]: Exemple extret de [sourcemaking.com](https://sourcemaking.com/refactoring/replace-parameter-with-method-call)

```js
const finalPrice = discountedPrice(
    basePrice,
    seasonDiscount,
    fees);
```

**Possible solució:** _Replace Parameter with Method Call_

# Tècniques de refactoring

## Extract method

S'usa quan tenim un mètode o classe molt llargs i podem trencar el codi en diverses parts més especialitzades.

Exemple:

```js
//
// Abans
//
productDetails(): void {
  const product = getProduct();

  console.log("name: " + product.name);
  console.log("price: " + product.price);
}
//
// Després
//
productDetails(): void {
  const product = getProduct();
  printProductDetails(product);
}

printProductDetails(product: Product): void {
  console.log("name: " + product.name);
  console.log("price: " + product.price);
}

```

## Extract variable

Quan tenim una expressió difícil de comprendre, assignar-la a una variable facilita la seua utilització per exemple en _if statements_.

Exemple:

```js
// Abans
getDetails(user: User): UserDetails {
  if (user.type === 'Admin' ||
  user.type === 'Manager' ||
  user.type === 'Owner'
  )
  {
    // do something
  }
}

// Després
getDetails(user: User): UserDetails {
  const isAdmin = user.type === 'Admin';
  const isManager = user.type === 'Manager';
  const isOwner = user.type === 'Owner';

  if(isAdmin || isManager || isOwner)
  {
    // do something
  }
}
```

## Rename method

Quan tenim un mètode amb una nomenclatura que no reflecteix allò que fa.

Exemple:

```js
// abans
metodeAmbUnNomPocAdequat(input: number): number {
  return input * 2;
}

// després
duplicate(input: number): number {
  return input * 2;
}
```

## Pull Up Method

Quan tenim dues subclasses amb el mateix mètode podem moure aquest camp a la classe mare.

Exemple:

```js
// abans
class dog extends animal {
  breath(){
    // ...
  }
}

class cat extends animal {
  breath(){
    // ...
  }
}

// després
class animal {
  breath(){
    // ...
  }
}
```

## Pull Up field

Quan tenim dues subclasses amb el mateix camp podem moure aquest camp a la classe mare.

Exemple:

```js
// abans
class dog extends animal {
  age: number
}

class cat extends animal {
  age: number
}

// després
class animal {
  age: number
}
```

## Introduce Parameter Object

Quan tenim paràmetres que es repeteixen al llarg de diferents parts del codi podem extreure una classe per estandarditzar aquests paràmetres i afegir mètodes per manipular-los si fos necessari.

Exemple:

```js
// abans
connect(url: string, headers: Headers, token: Token){
  // ...
}

// després
connect(connection: ConnectionObject){
  // ...
}

```

## Substitute Algorithm

Quan volem canviar un algorisme per un altre més senzill o més eficient.

Exemple:

```js
// abans
getIngredient(ingredients: string[]): string{
  for (let ingredient of ingredients) {
    if (ingredient.equals("Arròs")){
      return "Arròs";
    }
    if (ingredient.equals("Caldo")){
      return "Caldo";
    }
    if (ingredient.equals("Pollastre")){
      return "Pollastre";
    }
  }
  return "";
}

// després
getIngredient(ingredients: string[]): string{
  let possibilities = ["Arròs", "Caldo", "Pollastre"];
  for (let ingredient of ingredients) {
    if (possibilities.includes(ingredient)) {
      return ingredient;
    }
  }
  return "";
}
```

# Refactoring switch/case amb el patró _Strategy_

```js
// Implementem el manager d'estratègies
class LoginMethod {
  constructor() {
    this._strategy = null;
  }
  set strategy(strategy) {
    this._strategy = strategy;
  }
  get strategy() {
    return this._strategy;
  }
  login() {
    this._strategy.login();
  }
}

// Implementem cada estratègia
class GoogleLogin {
  login() {
    // login with Google
  }
}

class FacebookLogin {
  login() {
    // login with facebook
  }
}
class EmailLogin {
  login() {
    // login with email
  }
}

// Apliquem el patró al nostre context

const loginManager = new LoginManager();
const googleLogin = new GoogleLogin();
const facebookLogin = new FacebookLogin();
const emailLogin = new EmailLogin();

// Suposem que l'usuari tria Google login
loginManager.strategy = googleLogin;
loginManager.login();

```

# Refactoring Tourist app

## Dead code

Com que hem anat iterant la nostra app al llarg de diversos exercicis, he trobat alguns exemples de codi que ja no té cap utilitat

En aquest cas el _smell code_ el podríem catalogar de _dead code_.

La possible solució passa per usar, amb l'ajut d'un bon IDE con VS Code, detectar el codi que no està en ús (marcat amb un color més clar per VS Code) i eliminar-lo.

Per exemple a login.service.ts hi ha dues línies a eliminar:

```js
// ...
export class LoginService {

  public isLoggedIn: boolean = false;
  
  private logger = new Subject<boolean>() // dead code

  constructor(
    private storageService: StorageService, // dead code
    private profileService: ProfileService
  ) { }

  login({email, password}: Credentials): Observable<User>  {
    const dbUsers = this.profileService.getUsers()
    return dbUsers.pipe(
      map(
        users => {
          const user = users.find(user => user.email === email && user.password === password)
            if (user) {
              return user
            } else {
              throw('Wrong email or password')
            }
        })
    )
  }

}

```

El mateix ocorre amb _imports_ de mòduls que ja no tenim en ús.

## Long method

Alguns mètodes han anat creixent i incrementant la complexitat del codi. Una possible solució és l'anomenat _Extract Method_.

Per exemple a `activities.component.ts` tenia el següent codi al mètode _ngInit_:

```js
ngOnInit(): void {
  this.store.select('login').subscribe(state =>{
    this.isTourist = state.user && state.user.type === 0
  })

  // reset selected activity
  this.store.dispatch(selectActivity(null))

  // get activities and subscribe
  this.store.dispatch(getActivities())
  this.store.select('activities').subscribe( state => {
    const selectedActivity = state.selectedActivity
    this.selectedActivity = selectedActivity
    this.loading = state.loading

    const activities = state.activities
    if (activities && this.userId) {
      this.store.select('profile').subscribe(profile => {
        const myActivities = profile.activities
        const myActivitiesArray = myActivities.map(act => act.activityId)
        this.activities = activities.filter(act => myActivitiesArray.includes(act.id))
      })
    } else if (activities && this.ownerId) {
      const ownerActivities = activities.filter(act => act.userId == this.ownerId)
      this.activities = ownerActivities
    } else {
      this.activities = activities
    }
  })
}
```

Després d'aplicar la refactorització ha quedat així:

```js
ngOnInit(): void {
  this.store.select('login').subscribe(state =>{
    this.isTourist = state.user && state.user.type === 0
  })

  // reset selected activity
  this.store.dispatch(selectActivity(null))

  // get activities
  this.store.dispatch(getActivities())

  // subscribe to activities
  this.subscribeActivities()
}
```

## Duplicated code

Aquesta correcció ja la vaig aplicar al seu moment. Es tracta en aquest cas d'evitar posar manualment el valor d'un mateix paràmetre que es repeteix al llarg de diferents mètodes.

En aquest cas apliquem la tècnica _Extract variable_.

Per exemple a _activities.service.ts_:

```js
// ...
getActivities(): Observable<Activity[]> {
  return this.http.get<Activity[]>('api/activities')
  .pipe()
}

getActivity(id: number): Observable<Activity> {
  return this.http.get<Activity>(`api/activities/${id}`)
  .pipe()
}
// ...
```

Passa a ser:

```js
// ...
activitiesUrl = 'api/activities'

getActivities(): Observable<Activity[]> {
  return this.http.get<Activity[]>(this.activitiesUrl)
  .pipe()
}

getActivity(id: number): Observable<Activity> {
  return this.http.get<Activity>(`${this.activitiesUrl}/${id}`)
  .pipe()
}
// ...
```

El codi font de la app amb les refactoritzacions ja aplicades es pot trobar a la carpeta `exercici4`.
