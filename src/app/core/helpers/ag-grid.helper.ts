export function syncPaginationWithBtn() {
  const pagingPanel = document.querySelector('.ag-paging-panel');
  (pagingPanel as HTMLElement).style.flexDirection = 'row';
  const customPagination = document.querySelector('.custom-pagination');
  const btnAction = document.querySelector('.btn-action');

  const agPagingPageSummaryPanel = document.querySelector('.ag-paging-page-summary-panel');
  const agPagingRowSummaryPanel = document.querySelector('.ag-paging-row-summary-panel');
  const currentPageInput = document.querySelector('.current-paging');
  const currentPage = document.querySelector('.ag-paging-description');
  currentPage.children[1].parentNode.insertBefore(currentPageInput, currentPage.children[1].nextSibling);
  currentPage.children[1].remove();

  customPagination.prepend(agPagingRowSummaryPanel);
  customPagination.appendChild(agPagingPageSummaryPanel);
  pagingPanel.appendChild(customPagination);
  pagingPanel.appendChild(btnAction);
}

export function syncPaginationWithoutBtn() {
  const pagingPanel = document.querySelector('.ag-paging-panel');
  const customPagination = document.querySelector('.custom-pagination');

  const agPagingPageSummaryPanel = document.querySelector('.ag-paging-page-summary-panel');
  const currentPageInput = document.querySelector('.current-paging');
  const currentPage = document.querySelector('.ag-paging-description');
  currentPage.children[1].parentNode.insertBefore(currentPageInput, currentPage.children[1].nextSibling);
  currentPage.children[1].remove();

  customPagination.appendChild(agPagingPageSummaryPanel);
  pagingPanel.appendChild(customPagination);
}

export function syncColumnSelectPanel() {
  const agColumnSelect = document.querySelector('.ag-tool-panel-wrapper .ag-column-select');
  const matExportBtn = document.querySelector('.mat-export-btn');
  agColumnSelect.prepend(matExportBtn);
}


export function syncColumnNestedSelectPanel() {
  const agColumnSelectList = document.querySelectorAll('.ag-tool-panel-wrapper .ag-column-select');
  const matExportBtns = document.querySelectorAll('.mat-export-btns');
  const matResetBtns = document.querySelectorAll('.mat-reset-btns');

  if (agColumnSelectList.length >= 2) {
    const secondAgColumnSelect = agColumnSelectList[1];
    matExportBtns.forEach((exportBtn) => {
      secondAgColumnSelect.prepend(exportBtn);
    });
  } else {
    const agColumnSelect = document.querySelector('.ag-tool-panel-wrapper .ag-column-select');
    matExportBtns.forEach((exportBtn) => {
      agColumnSelect.prepend(exportBtn);
    });
  }

  const agColumnSelect = document.querySelector('.ag-tool-panel-wrapper .ag-column-select');
  matResetBtns.forEach((resetBtn) => {
    agColumnSelect.prepend(resetBtn);
  });
}

export function syncColumnReset() {
  const agColumnSelect = document.querySelector('.ag-tool-panel-wrapper .ag-column-select');
  const matExportBtn = document.querySelector('.mat-reset-btn');

  agColumnSelect.prepend(matExportBtn);
}

export function syncNestedColumnReset() {
  const agColumnSelectList = document.querySelectorAll('.ag-tool-panel-wrapper .ag-column-select');
  const matExportBtn = document.querySelector('.mat-reset-btns');
  if (agColumnSelectList.length >= 2) {
    const secondAgColumnSelect = agColumnSelectList[1];
    secondAgColumnSelect.prepend(matExportBtn);
  }
}

