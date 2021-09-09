let csvFile;
let listVille = [];
let nbPermutation = 0;
let nbComparaison = 0;


document.querySelector("#read-button").addEventListener('click', function () {
    csvFile = document.querySelector("#file-input").files[0];
    let reader = new FileReader();
    reader.addEventListener('load', function (e) {
        // récupération de la liste des villes
        listVille = getArrayCsv(e.target.result);

        // Calcul de la distance des villes par rapport à Grenoble
        listVille.forEach(ville => {
            ville.distanceFromGrenoble = distanceFromGrenoble(ville);
        });
        // Tri
        const algo = $("#algo-select").val();
        nbPermutation = 0;
        nbComparaison = 0;
        sort(algo);

        // Affichage 
        displayListVille()

    });
    reader.readAsText(csvFile)
})

/**
 * Récupére la liste des villes contenu dans le fichier csv
 * @param csv fichier csv brut
 * @returns la liste des villes mis en forme
 */
function getArrayCsv(csv) {
    let listLine = csv.split("\n")
    listVille = [];
    let isFirstLine = true;
    listLine.forEach(line => {
        if (isFirstLine || line === '') {
            isFirstLine = false;
        } else {
            let listColumn = line.split(";");
            listVille.push(
                new Ville(
                    listColumn[8],
                    listColumn[9],
                    listColumn[11],
                    listColumn[12],
                    listColumn[13],
                    0
                )
            );
        }
    });
    return listVille;
}

/**
 * Calcul de la distance entre Grenoble et une ville donnée
 * @param ville ville
 * @returns la distance qui sépare la ville de Grenoble
 */
function distanceFromGrenoble(ville) {
    const lat1 = 45.188529;
    const lon1 = 5.724524;
    const lat2 = ville.latitude;
    const lon2 = ville.longitude;
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c / 1000; // in kilometres

    return d;
}

/**
 * Retourne vrai si la ville i est plus proche de Grenoble
 * par rapport à j
 * @param {*} i distance de la ville i
 * @param {*} j distance de la ville j
 * @return vrai si la ville i est plus proche
 */
function isLess(i, j) {

    if (i.distanceFromGrenoble < j.distanceFromGrenoble) {
        return true;
    }

}

/**
 * interverti la ville i avec la ville j dans la liste des villes
 * @param {*} i
 * @param {*} j  @param {*} tableau
 */
function swap(tableau, i, j) {
   // [listVille[j], listVille[i]]=[listVille[i], listVille[j]]
    let temp = tableau[i];
    tableau[i] = tableau[j];
    tableau[j] = temp;
    nbPermutation++;


}

function sort(type) {
    switch (type) {
        case 'insert':
            listVille = insertsort(listVille);
            break;
        case 'select':
            listVille = selectionsort(listVille);
            break;
        case 'bubble':
            listVille = bubblesort(listVille);
            break;
        case 'shell':
            listVille = shellsort(listVille);
            break;
        case 'merge':
            listVille = mergesort(listVille, 0, listVille.length - 1);
            break;
        case 'heap':
            listVille = heapsort(listVille, 0, listVille.length - 1);
            break;
        case 'quick':
            listVille = quicksort(listVille, 0, listVille.length - 1);
            break;
    }
}

//tri par insertion
function insertsort(tableau) {
   // nbPermutation = 0;
    tableau = [...tableau];
    for (let i = 0; i < tableau.length; i++) {
        let temp = tableau[i];
        let j = i;
        while (j > 0 && isLess(temp, tableau[j - 1])) {
            swap(tableau, j, j - 1);
            j=j-1;
        }
        tableau[j] = temp;

    }
    return tableau;
}

//tri par selection
function selectionsort(tableau) {
   // nbPermutation = 0;
    tableau = [...tableau];
    for (let i = 0; i < tableau.length; i++) {
        let min = i;
        for (let j = i + 1; j < tableau.length; j++) {
            if (isLess(tableau[j], tableau[min])) {
                min = j;
            }
        }
        swap(tableau, i, min);
    }
    return tableau;

}

//tri à bulles
function bubblesort(tableau) {
   // nbPermutation = 0;
    tableau = [...tableau];
    let passage = 0;                                               //passage <-0
    let permut = true;                                               //permut<-vrai
    while (permut===true) {                                           //tant que permut est vrai
        permut = false;                                               //permut <-faux
        passage++;
        for (let i = 0; i < tableau.length - 1; i++) {                 //pour i de 0 à n-1
            if (isLess(tableau[i + 1], tableau[i])) {                   // si T[i]>T[i+1]
                //permut<-vrai
                swap(tableau, i, i + 1);                               //on échange les deux éléments;
                permut = true;
            }
        }
        //fin pour
    }
    return tableau;

}

//tri shell
function shellsort(tableau) {
   // nbPermutation = 0;
    tableau = [...tableau];
    let longueur = tableau.length;                                           // longueur ← taille(T)
    let n = 0;                                                              // n ← 0; le pas
    while (n < longueur) {                                                   // Tant que n<longueur faire
        n = (3 * n + 1);                                                           // #calcul du plus grand décalage possible
    }                                                                        // n ← (3*n+1)
    while (n !== 0) {                                                         // fin tantque
        n = Math.floor(n / 3);  //console.log(n)                          // Tant que n différent de 0 faire
        for (let i = n; i < longueur; i++) {                                  // n ← (n/3)
            let temp = tableau[i];                                           // pour i=n à longueur faire
            let j = i;  // nbPermutation++;                                   // valeur ← T(i) //valeur à décaler (éventuellement)
            while ((j > n - 1) && isLess(temp, tableau[j - n]))               // j ← i
            {
                swap(tableau, j, j-n)  //tableau[j] = tableau[j - n]
                j = j - n;
            }                                                                     // Tant que (j>n-1) et (T(j-n)>valeur)
           tableau[j]=temp;                                                      // T(j) ← T(j-n) //décalage des valeurs avec un pas de n
        }                                                                        // j ← j-n
    }                                                                            // fin tantque
    return tableau;                                                             // T(j) ← valeur
}


//tri par fusion
function mergesort(tableau) {
    tableau = [...tableau];                                               // procédure tri_fusion (tableau T[1, …, n]) with 1 ==> 0 and n ==> n-1
    let n = tableau.length                                                       // avec n = T.length
    if (n <= 1) {                                                               // si n ≤ 1
        return tableau;                                                         // renvoyer T
    } else {                                                                  // sinon
        return merge(                                                            // renvoyer fusion(triFusion(T[1, …, n/2]), triFusion(T[n/2 + 1, …, n]) avec fusion(left, right)
            mergesort(tableau.slice(0, Math.floor(n / 2))),                  // moitié gauche => .slice(début, fin) pour couper le tableau en 2 avec début = index 0 et fin = n/2 (Math.floor car nombre d'index impair après slice)
            mergesort(tableau.slice(Math.floor(n / 2), n))                   // moitié droite => .slice(début, fin) pour couper le tableau en 2 avec début = n/2 (Math.floor car nombre d'index impair après slice) et fin = n
        )
    }
}                                                                               // fin
function merge(left, right) {                                                  // procédure fusion(Tableau A[1, …, a], Tableau B[1, …, b]) avec a = A.length et b = B.length
    if (left.length === 0) {                                                    // si A est le tableau vide
        return right                                                            // renvoyer B
    } else if (right.length === 0) {                                             // si B est le tableau vide
        return left                                                             // renvoyer A
    } else if (isLess(left[0], right[0])) {
        //nbPermutation++;     //49 permut                                      // si A[1] ≤ B[1] où 1 correspond à la valeur de l'index 0
        return [left[0]].concat(merge(left.slice(1, left.length), right))

        // renvoyer A[1] ⊕ fusion(A[2, …, a], B) où 2 correspond à la valeur de l'index 1
    } else {
        //nbPermutation++;  //51 permut                                                          // sinon
        return [right[0]].concat(merge(left, right.slice(1, right.length)))    // renvoyer B[1] ⊕ fusion(A, B[2, …, b])
    }


}


//tri par tas
function heapsort(tableau) {
    //nbPermutation = 0;
    tableau = [...tableau];
    let i;
    organiser(tableau);
    for (i = tableau.length - 1; i > 0; i--) {
        swap(tableau, 0, i);
        redescendre(tableau, i, 0);

    }
    return tableau
}

function organiser(tableau) {

    let i; //index tableau
    for (i = 0; i < tableau.length - 1; i++) {
        remonter(tableau, i);

    }
}

function remonter(tableau, index) {

    if (isLess(tableau[Math.floor(index / 2)], tableau[index])) {
        swap(tableau, index, Math.floor(index / 2));
        remonter(tableau, Math.floor(index / 2))
    }
}

function redescendre(tableau, element, index) {
    let max;
    let formule = 2 * index + 1;
    if (formule < element) {
        if (isLess(tableau[2 * index], tableau[formule])) {
            max = formule;
        } else {
            max = 2 * index;
        }

        if (isLess(tableau[index], tableau[max])) {
            swap(tableau, max, index);
            redescendre(tableau, element, max);
        }
    }
}


//tri rapide
function quicksort(tableau, indexleft, indexright) {
    // nbPermutation = 0;
    // tableau = [...tableau];
    if (indexleft < indexright) {

        let pi = partitionner(tableau, indexleft, indexright)               // pi ← partitionner(tableau, premier, dernier) # pi : index de partitionnement
        quicksort(tableau, indexleft, pi - 1)                //tant qu'il n'a pas fini la partie gauche il ne rentre pas dans la partie droite
        quicksort(tableau, pi + 1, indexright)
    }
    return tableau;
}

function partitionner(tableau, indexleft, indexright) {
    let pivot = indexright;
    let j = indexleft;
    for (let i = indexleft; i < indexright; i++) {
        if (isLess(tableau[i], tableau[pivot])) {
            swap(tableau, i, j);
            j++;
        }
    }
    swap(tableau, indexright, j)
    return j
}


/** MODEL */

class Ville {
    constructor(nom_commune, codes_postaux, latitude, longitude, dist, distanceFromGrenoble) {
        this.nom_commune = nom_commune;
        this.codes_postaux = codes_postaux;
        this.latitude = latitude;
        this.longitude = longitude;
        this.dist = dist;
        this.distanceFromGrenoble = distanceFromGrenoble;
    }
}

/** AFFICHAGE */
function displayPermutation(nbPermutation) {
    document.getElementById('permutation').innerHTML = nbPermutation + ' permutations';
}

function displayListVille() {
    document.getElementById("navp").innerHTML = "";
    displayPermutation(nbPermutation);
    let mainList = document.getElementById("navp");
    for (let i = 0; i < listVille.length; i++) {
        let item = listVille[i];
        let elem = document.createElement("li");
        elem.innerHTML = item.nom_commune + " - \t" + Math.round(item.distanceFromGrenoble * 100) / 100 + ' km';
        mainList.appendChild(elem);
    }
}
