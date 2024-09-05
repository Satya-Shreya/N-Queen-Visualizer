
const numberbox = document.getElementById("numberbox");
const playButton = document.getElementById('play-button');

const queen = '<i class="fas fa-chess-queen" style="color:#E1AFD1"></i>';

let n, q, Board = 0;

let array = [0, 1, 0, 0, 2, 10, 4, 40, 92];
let pos = {};

class Queen {
    constructor() {
        this.position = Object.assign({}, pos);
        this.uuid = [];
    }

    nQueen = async () => {
        Board = 0;
        this.position[`${Board}`] = {};
        numberbox.disabled = true;
        await this.solveQueen(Board, 0, n);
        await this.clearColor(Board);
        numberbox.disabled = false;
    }

    isValid = async (board, r, col, n) => {
        const table = document.getElementById(`table-${this.uuid[board]}`);
        const currentRow = table.firstChild.childNodes[r];
        const currentColumn = currentRow.getElementsByTagName("td")[col];
        currentColumn.innerHTML = queen;
        await this.delay();

        for (let i = r - 1; i >= 0; --i) {
            const row = table.firstChild.childNodes[i];
            const column = row.getElementsByTagName("td")[col];
            const value = column.innerHTML;

            if (value == queen) {
                column.style.backgroundColor = "#A1DD70";
                currentColumn.innerHTML = "-"
                return false;
            }
            column.style.backgroundColor = "#E72929";
            await this.delay();
        }

        for (let i = r - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
            const row = table.firstChild.childNodes[i];
            const column = row.getElementsByTagName("td")[j];
            const value = column.innerHTML;

            if (value == queen) {
                column.style.backgroundColor = "#A1DD70";
                currentColumn.innerHTML = "-"
                return false;
            }
            column.style.backgroundColor = "#E72929";
            await this.delay();
        }

        for (let i = r - 1, j = col + 1; i >= 0 && j < n; --i, ++j) {
            const row = table.firstChild.childNodes[i];
            const column = row.getElementsByTagName("td")[j];
            const value = column.innerHTML;

            if (value == queen) {
                column.style.backgroundColor = "#A1DD70";
                currentColumn.innerHTML = "-"
                return false;
            }
            column.style.backgroundColor = "#E72929";
            await this.delay();
        }
        return true;
    }

    clearColor = async (board) => {
        for (let j = 0; j < n; ++j) {
            const table = document.getElementById(`table-${this.uuid[board]}`);
            const row = table.firstChild.childNodes[j];
            for (let k = 0; k < n; ++k)
                (j + k) & 1
                    ? (row.getElementsByTagName("td")[k].style.backgroundColor = "#040D12")
                    : (row.getElementsByTagName("td")[k].style.backgroundColor = "#F6F4EB");
        }
    }

    delay = async () => {
        await new Promise((done) => setTimeout(() => done(), 60));
    }

    solveQueen = async (board, r, n) => {
        if (r == n) {
            ++Board;
            let table = document.getElementById(`table-${this.uuid[Board]}`);
            for (let k = 0; k < n; ++k) {
                let row = table.firstChild.childNodes[k];
                row.getElementsByTagName("td")[this.position[board][k]].innerHTML = queen;
            }
            this.position[Board] = this.position[board];
            return;
        }

        for (let i = 0; i < n; ++i) {
            await this.delay();
            await this.clearColor(board);
            if (await this.isValid(board, r, i, n)) {
                await this.delay();
                await this.clearColor(board);
                let table = document.getElementById(`table-${this.uuid[board]}`);
                let row = table.firstChild.childNodes[r];
                row.getElementsByTagName("td")[i].innerHTML = queen;

                this.position[board][r] = i;

                if (await this.solveQueen(board, r + 1, n))
                    await this.clearColor(board);

                await this.delay();
                board = Board;
                table = document.getElementById(`table-${this.uuid[board]}`);
                row = table.firstChild.childNodes[r];
                row.getElementsByTagName("td")[i].innerHTML = "-";

                delete this.position[`${board}`][`${r}`];
            }
        }
    }
}

playButton.onclick = async function visualise() {
    const chessBoard = document.getElementById("n-queen-board");
    const arrangement = document.getElementById("queen-arrangement");

    n = numberbox.value;
    q = new Queen();

    if (n > 8) {
        numberbox.value = "";
        alert("Queen value is too large");
        return;
    } else if (n < 1) {
        numberbox.value = "";
        alert("Queen value is too small");
        return;
    }

    while (chessBoard.hasChildNodes()) {
        chessBoard.removeChild(chessBoard.firstChild);
    }
    if (arrangement.hasChildNodes()) {
        arrangement.removeChild(arrangement.lastChild)
    }

    const para = document.createElement("p");
    para.setAttribute("class", "queen-info");
    para.innerHTML = `For ${n}x${n} board, ${array[n] } arrangements are possible.`;
    arrangement.appendChild(para);

    if (chessBoard.childElementCount === 0) {
        for (let i = 0; i < array[n]; ++i) {
            q.uuid.push(Math.random());
            let div = document.createElement('div');
            div.setAttribute("class", "board-container");
            let table = document.createElement('table');
            let header = document.createElement('h4');
            header.innerHTML = `Board ${i + 1}`;
            table.setAttribute("id", `table-${q.uuid[i]}`);
            header.setAttribute("id", `paragraph-${i}`);
            chessBoard.appendChild(div);
            div.appendChild(header);
            div.appendChild(table);
        }
    }

    for (let k = 0; k < array[n]; ++k) {
        let table = document.getElementById(`table-${q.uuid[k]}`);
        table.style.width = "320px"; 
        table.style.height = "320px"; 
        for (let i = 0; i < n; ++i) {
            const row = table.insertRow(i);
            row.setAttribute("id", `Row${i}`);
            for (let j = 0; j < n; ++j) {
                const col = row.insertCell(j);
                col.style.width = `${320 / n}px`;
                col.style.height = `${320 / n}px`; 
                (i + j) & 1
                    ? (col.style.backgroundColor = "#040D12")
                    : (col.style.backgroundColor = "#F6F4EB");
                col.innerHTML = "-";
                col.style.border = "1px solid #373f51";
            }
        }
        await q.clearColor(k);
    }
    await q.nQueen();
    console.log("Visualization completed.");
};
