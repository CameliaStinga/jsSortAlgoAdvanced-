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
 * @param {*} j
 */
function swap(i, j) {
    let temp = listVille[i];
    listVille[i] = listVille[j];
    listVille[j] = temp;


}

function sort(type) {
    switch (type) {
        case 'insert':
            insertsort(listVille);
            break;
        case 'select':
            selectionsort(listVille);
            break;
        case 'bubble':
            bubblesort(listVille);
            break;
        case 'shell':
            shellsort(listVille);
            break;
        case 'merge':
            listVille = mergesort(listVille, 0, listVille.length - 1);
            break;
        case 'heap':
            heapsort(listVille);

            break;
        case 'quick':
            quicksort(listVille);
            break;
    }
}

//tri par insertion
function insertsort(listVille) {
    let i;
    for (i = 0; i < listVille.length; i++) {
        let temp = listVille[i];
        let j = i;
        while (j > 0 && isLess(temp, listVille[j - 1])) {
            listVille[j] = listVille[j - 1];
            j = j - 1;

        }
        listVille[j] = temp

    }
    return listVille;

}

//tri par selection
function selectionsort(listVille) {
    for (let i = 0; i < listVille.length; i++) {
        let min = i;
        for (let j = i + 1; j < listVille.length; j++) {
            if (isLess(listVille[j], listVille[min])) {
                min = j;
            }
        }
        swap(i, min);
    }
    return listVille;

}

//tri à bulles
function bubblesort(listVille) {
    let passage = 0;                                 //passage <-0
    let permutation = true;                         //permut<-vrai
    while (permutation) {                     //tant que permut est vrai
        permutation = false;                          //permut <-faux
        passage++;
        for (let i = 0; i < listVille.length - 1; i++) {      //pour i de 0 à n-1
            if (isLess(listVille[i + 1], listVille[i])) {    // si T[i]>T[i+1]
                permutation = true;                 //permut<-vrai
                swap(i, i + 1);                         //on échange les deux éléments;

            }
        }
        //fin pour
    }
    return listVille;

}

//tri shell
function shellsort(listVille) {
    let longueur = listVille.length;                                    // longueur ← taille(T)
    let n = 0;                                                           // n ← 0; le pas
    while (n < longueur) {                                                 // Tant que n<longueur faire
        n = (3 * n + 1);    //console.log(n)                                                 // #calcul du plus grand décalage possible
    }                                                                       // n ← (3*n+1)
    while (n != 0) {                                                         // fin tantque
        n = Math.floor(n / 3);  //console.log(n)                          // Tant que n différent de 0 faire
        for (let i = n; i < longueur; i++) {                               // n ← (n/3)
            let temp = listVille[i];                                     // pour i=n à longueur faire
            let j = i;                                                    // valeur ← T(i) //valeur à décaler (éventuellement)
            while ((j > n - 1) && isLess(temp, listVille[j - n]))             // j ← i
            {
                listVille[j] = listVille[j - n]                                 // Tant que (j>n-1) et (T(j-n)>valeur)
                j = j - n;                                                       // T(j) ← T(j-n) //décalage des valeurs avec un pas de n
            }                                                                    // j ← j-n
            listVille[j] = temp;                                          // fin tantque
        }                                                                           // T(j) ← valeur
    }
    return listVille;
}

//tri par fusion
function mergesort(listVille) {                                                      // procédure tri_fusion (tableau T[1, …, n]) with 1 ==> 0 and n ==> n-1
    let n = listVille.length                                                       // avec n = T.length
    if (n <= 1) {                                                               // si n ≤ 1
        return listVille                                                           // renvoyer T
    } else {                                                                  // sinon
        return merge(                                                            // renvoyer fusion(triFusion(T[1, …, n/2]), triFusion(T[n/2 + 1, …, n]) avec fusion(left, right)
            mergesort(listVille.slice(0, Math.floor(n / 2))),                  // moitié gauche => .slice(début, fin) pour couper le tableau en 2 avec début = index 0 et fin = n/2 (Math.floor car nombre d'index impair après slice)
            mergesort(listVille.slice(Math.floor(n / 2), n))                   // moitié droite => .slice(début, fin) pour couper le tableau en 2 avec début = n/2 (Math.floor car nombre d'index impair après slice) et fin = n
        )
    }
}                                                                               // fin
function merge(left, right) {                                                  // procédure fusion(Tableau A[1, …, a], Tableau B[1, …, b]) avec a = A.length et b = B.length
    if (left.length === 0) {                                                    // si A est le tableau vide
        return right                                                            // renvoyer B
    } else if (right.length === 0) {                                             // si B est le tableau vide
        return left                                                             // renvoyer A
    } else if (isLess(left[0], right[0])) {                                            // si A[1] ≤ B[1] où 1 correspond à la valeur de l'index 0
        return [left[0]].concat(merge(left.slice(1, left.length), right))      // renvoyer A[1] ⊕ fusion(A[2, …, a], B) où 2 correspond à la valeur de l'index 1
    } else {                                                                    // sinon
        return [right[0]].concat(merge(left, right.slice(1, right.length)))    // renvoyer B[1] ⊕ fusion(A, B[2, …, b])
    }
}


//tri par tas
function heapsort(listVille) {
    let i;
    organiser(listVille);
    for (i = listVille.length - 1; i > 0; i--) {
        swap(0, i);
        redescendre(listVille, i, 0);

    }
    return listVille
}

function organiser(listVille) {

    let i; //index tableau
    for (i = 0; i < listVille.length - 1; i++) {
        remonter(listVille, i);

    }
}

function remonter(listVille, index) {
    // if(index==0){
    //     return triNombres;
    // }
    if (isLess(listVille[Math.floor(index / 2)], listVille[index])) {
        swap(index, Math.floor(index / 2));
        remonter(listVille, Math.floor(index / 2))
    }
}

function redescendre(listVille, element, index) {
    let max;
    let formule = 2 * index + 1;
    if (formule < element) {
        if (isLess(listVille[2 * index], listVille[formule])) {
            max = formule;
        } else {
            max = 2 * index;
        }

        if (isLess(listVille[index], listVille[max])) {
            swap(max, index);
            redescendre(listVille, element, max);
        }
    }
}


// function echanger(listVille, indexA, indexB) {
//     let temp = listVille[indexA];
//     listVille[indexA] = listVille[indexB];
//     listVille[indexB] = temp;
//
// }


//tri rapide
function quicksort(listVille, indexleft = 0, indexright = listVille.length - 1) {
    if (indexleft < indexright) {                                      //left et right sont des index; l'index du premier element infèrieur à l'index du dernier element
        //on compare ensuite les valeurs correspondantes aux index         // si premier < dernier alors
        let pi = partitionner(listVille, indexleft, indexright)    // partionnement de tout mon tableau; pi nous donne l'endroit ou on doit couper le tableau                                            // pi ← partitionner(tableau, premier, dernier) # pi : index de partitionnement
        quicksort(listVille, indexleft, pi - 1)            //tant qu'il n'a pas fini la partie gauche il ne rentre pas dans la partie droite                                                          // tri_rapide(tableau, premier, pi - 1)
        quicksort(listVille, pi + 1, indexright)                                                                                                                                               // tri_rapide(tableau, pi + 1, dernier)
    }
    return listVille;
}

function swap(listVille, indexleft, indexright) {
    let temp = listVille[indexleft];
    listVille[indexleft] = listVille[indexright];
    listVille[indexright] = temp;
}

function partitionner(listVille, indexleft, indexright) {
    let pivot = indexright;
    let j = indexleft;
    for (let i = indexleft; i < indexright; i++) {
        if (isLess(listVille[i], listVille[pivot])) {
            swap(listVille, i, j);
            j++;
        }
    }
    swap(listVille, indexright, j)
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
    for (var i = 0; i < listVille.length; i++) {
        let item = listVille[i];
        let elem = document.createElement("li");
        elem.innerHTML = item.nom_commune + " - \t" + Math.round(item.distanceFromGrenoble * 100) / 100 + ' km';
        mainList.appendChild(elem);
    }
}
