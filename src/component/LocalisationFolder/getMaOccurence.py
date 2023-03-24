import csv

# Ouvrir le fichier CSV
with open('Co.csv', newline='') as csvfile:
    reader = csv.reader(csvfile)

    # Initialiser un dictionnaire pour stocker les occurrences de chaque valeur
    occurences = {}

    # Parcourir chaque ligne du fichier CSV
    for row in reader:
        # Parcourir chaque valeur de la ligne
        for value in row:
            # Si la valeur existe déjà dans le dictionnaire, incrémenter son compteur
            if value in occurences:
                occurences[value] += 1
            # Sinon, ajouter la valeur au dictionnaire avec un compteur initialisé à 1
            else:
                occurences[value] = 1

occurences = dict(sorted(occurences.items(), key=lambda item: item[1], reverse=True))




with open('classement.csv', mode='w', newline='') as csv_file:

    # définition des noms de colonnes
    fieldnames = ['codePays', 'count']

    # création d'un objet DictWriter pour écrire dans le fichier CSV
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)

    # écriture de la ligne dans le fichier CSV

    # Afficher les résultats triés
    for code_pays, count in occurences.items():
        if count!=1 and len(code_pays)==2:
         print(f"{code_pays}: {count}")
         writer.writerow({'codePays' :code_pays , 'count' : count})