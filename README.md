# WebAppAzureManagement

WebApp permettant de gérer les clouds Azure d'Exakis (Watts, Fenix, Devex, Deltacalor, GKP).

test des runners ggg

Notes :

- Pour la fonctionnalité de récupérer les A1 depuis une MAC donnée, le A1 est null 
dans les twins, il faut noter qu'il aurait été préférable d'avoir la donnée directement dans les twins
  (on peut forcer cette dernière en ajotuant l'A1 dans les twins desired)

#Stratégie


- Pour le refresh des data, envoyer un Uc =1 et lire les data dans report

- pour le User connected lire connectionState dans les twins du device ( 2 méthodes , soit boucle (pas ouf car trop de requête) ou toutes les X mins on fait une requête pour demander l'état de la variable
) soit uniquement quad on demande un refresh