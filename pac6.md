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

# Refactoring switch/case amb el patró _Strategy_

# Refactoring Tourist app
