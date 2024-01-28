function initBoard() {
  let board = [];
  for (let r = 0; r < 5; r++) {
    let row = [];
    for (let c = 0; c < 5; c++) {
      row.push(null);
    }
    board.push(row);
  }
}

export { initBoard };
