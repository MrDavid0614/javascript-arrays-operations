const clients = [
    { id: 1, taxNumber: '86620855', name: 'HECTOR ACUÑA BOLAÑOS' },
    { id: 2, taxNumber: '7317855K', name: 'JESUS RODRIGUEZ ALVAREZ' },
    { id: 3, taxNumber: '73826497', name: 'ANDRES NADAL MOLINA' },
    { id: 4, taxNumber: '88587715', name: 'SALVADOR ARNEDO MANRIQUEZ' },
    { id: 5, taxNumber: '94020190', name: 'VICTOR MANUEL ROJAS LUCAS' },
    { id: 6, taxNumber: '99804238', name: 'MOHAMED FERRE SAMPER' },
];
const accounts = [
    { clientId: 6, bankId: 1, balance: 15000 },
    { clientId: 1, bankId: 3, balance: 18000 },
    { clientId: 5, bankId: 3, balance: 135000 },
    { clientId: 2, bankId: 2, balance: 5600 },
    { clientId: 3, bankId: 1, balance: 23000 },
    { clientId: 5, bankId: 2, balance: 15000 },
    { clientId: 3, bankId: 3, balance: 45900 },
    { clientId: 2, bankId: 3, balance: 19000 },
    { clientId: 4, bankId: 3, balance: 51000 },
    { clientId: 5, bankId: 1, balance: 89000 },
    { clientId: 1, bankId: 2, balance: 1600 },
    { clientId: 5, bankId: 3, balance: 37500 },
    { clientId: 6, bankId: 1, balance: 19200 },
    { clientId: 2, bankId: 3, balance: 10000 },
    { clientId: 3, bankId: 2, balance: 5400 },
    { clientId: 3, bankId: 1, balance: 9000 },
    { clientId: 4, bankId: 3, balance: 13500 },
    { clientId: 2, bankId: 1, balance: 38200 },
    { clientId: 5, bankId: 2, balance: 17000 },
    { clientId: 1, bankId: 3, balance: 1000 },
    { clientId: 5, bankId: 2, balance: 600 },
    { clientId: 6, bankId: 1, balance: 16200 },
    { clientId: 2, bankId: 2, balance: 10000 },
];
const banks = [
    { id: 1, name: 'SANTANDER' },
    { id: 2, name: 'CHILE' },
    { id: 3, name: 'ESTADO' },
];

function getBankClients(bank) {
    const bankAccountsOwners = new Set(accounts.filter(account => account.bankId === bank.id)
                                                .map(account => account.clientId));

    return bankAccountsOwners;
}

// 0 Arreglo con los ids de clientes
function listClientsIds() {
    const clientsIds = clients.map(client => client.id);
    return clientsIds;
}

// 1 Arreglo con los ids de clientes ordenados por rut
function listClientsIdsSortByTaxNumber() {
    const clientsIdsSortedByTaxNumber = clients.sort((a, b) => a.taxNumber.localeCompare(b.taxNumber)).map(client => client.id);
    return clientsIdsSortedByTaxNumber;
}

// 2 Arreglo con los nombres de cliente ordenados de mayor a menor por la suma TOTAL de los saldos de cada cliente en los bancos que participa.
function sortClientsTotalBalances() {
    const clientsSortedByTotalBalances = clients.map(client => {
        const clientAccounts = accounts.filter(account => account.clientId === client.id);
        const totalBalance = clientAccounts.reduce((acc, current) => {
            return acc += current.balance;
        }, 0);

        return { name: client.name, balance: totalBalance };
    }).sort((a, b) => b.balance - a.balance);

    return clientsSortedByTotalBalances;
}

// 3 Objeto en que las claves sean los nombres de los bancos y los valores un arreglo con los ruts de sus clientes ordenados alfabeticamente por nombre.
function banksClientsTaxNumbers() {
    const banksObj = {};

    banks.forEach(bank => {
        const bankAccountsOwners = getBankClients(bank);

        const bankClients = clients.filter(client => bankAccountsOwners.has(client.id))
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map(client => client.taxNumber);

        banksObj[bank.name] = bankClients;
    });

    return banksObj;
}

// 4 Arreglo ordenado decrecientemente con los saldos de clientes que tengan más de 25.000 en el Banco SANTANDER
function richClientsBalances() {
    const bankSantander = banks.find(bank => bank.name === "SANTANDER");

    return accounts.filter(account => account.bankId === bankSantander.id && account.balance > 25000)
                    .map(account => account.balance)
                    .sort((a, b) => b - a);
}

// 5 Arreglo con ids de bancos ordenados crecientemente por la cantidad TOTAL de dinero que administran.
function banksRankingByTotalBalance() {
    const banksRanking = banks.map(bank => {
        const totalBalance = accounts.filter(account => account.bankId === bank.id)
                                    .reduce((acc, current) => acc += current.balance, 0);

        return { bankId: bank.id, totalBalance };
    }).sort((a, b) => b.totalBalance - a.totalBalance);

    return banksRanking;
}

// 6 Objeto en que las claves sean los nombres de los bancos y los valores el número de clientes que solo tengan cuentas en ese banco.
function banksFidelity() {
    const banksObj = {};
    const clientOccurrences = {};

    banks.forEach(bank => {
        const bankAccountsOwners = getBankClients(bank);
        bankAccountsOwners.forEach(client => clientOccurrences[client] ? clientOccurrences[client] += 1 : clientOccurrences[client] = 1);
    });

    const specialClients = Object.keys(clientOccurrences)
                                .filter(client => clientOccurrences[client] === 1)
                                .map(client => parseInt(client));

    specialClients.forEach(client => {
        banks.forEach(bank => {
            const bankClients = getBankClients(bank);
            if (bankClients.has(client))
                banksObj[bank.name] ? banksObj[bank.name] += 1 : banksObj[bank.name] = 1;
        })
    });

    return banksObj;
}

// 7 Objeto en que las claves sean los nombres de los bancos y los valores el id de su cliente con menos dinero.
function banksPoorClients() {
    const bankWithPoorestClient = banks.map(bank => {
        const bankClients = getBankClients(bank);
        const clientsMoney = [...bankClients].map(client => accounts.filter(account => account.clientId === client && account.bankId === bank.id)
                                                                    .reduce((acc, current) => ({clientId: current.clientId, balance: acc.balance += current.balance}), {clientId: 0, balance: 0}));
                            
        return clientsMoney.sort((a, b)=> a.balance - b.balance).map(client => ({name: bank.name, client: client.clientId}))[0];
    });

    return bankWithPoorestClient;
}

// 8 Agregar nuevo cliente con datos ficticios a "clientes" y agregar una cuenta en el BANCO ESTADO con un saldo de 9000 para este nuevo empleado.
// Luego devolver el lugar que ocupa este cliente en el ranking de la pregunta 2.
// No modificar arreglos originales para no alterar las respuestas anteriores al correr la solución
function newClientRanking() {
    const newClient = { id: 7, taxNumber: '95713205', name: 'HECTOR RODRIGUEZ MOLINA' };
    const newClientAccount = { clientId: 7, bankId: 3, balance: 9000 };
    const clientsCopy = [...clients, newClient];
    const accountsCopy = [...accounts, newClientAccount];

    const clientsSortedByTotalBalances = clientsCopy.map(client => {
        const totalBalance = accountsCopy.filter(account => account.clientId === client.id)
                        .reduce((acc, current) => acc += current.balance, 0);
        
        return {id: client.id, name: client.name, balance: totalBalance };
    }).sort((a, b) => b.balance - a.balance);

    return clientsSortedByTotalBalances.findIndex(client => client.id === newClient.id);
}
