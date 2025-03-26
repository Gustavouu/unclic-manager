
/**
 * Utilitários para testes da tela de Configurações
 * 
 * Este arquivo contém funções auxiliares para os testes manuais da tela
 * de Configurações, conforme o plano de testes definido.
 */

// Verifica se um elemento está visível e clicável
export const isElementInteractive = (element: HTMLElement): boolean => {
  if (!element) return false;
  
  const styles = window.getComputedStyle(element);
  
  // Verifica se o elemento está visível
  if (styles.display === 'none' || styles.visibility === 'hidden' || styles.opacity === '0') {
    return false;
  }
  
  // Verifica se o elemento tem pointer-events: none
  if (styles.pointerEvents === 'none') {
    return false;
  }
  
  // Verifica se o elemento não está sobreposto por outro elemento
  const rect = element.getBoundingClientRect();
  const elementAtPoint = document.elementFromPoint(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2
  );
  
  return element.contains(elementAtPoint) || element === elementAtPoint;
};

// Testa a navegação entre abas
export const testTabNavigation = (): { success: boolean; message: string } => {
  try {
    const tabTriggers = document.querySelectorAll('[role="tab"]');
    const tabContents = document.querySelectorAll('[role="tabpanel"]');
    
    if (tabTriggers.length === 0) {
      return { success: false, message: "Nenhuma aba encontrada" };
    }
    
    // Verifica se todas as abas são clicáveis
    for (const tab of tabTriggers) {
      if (!isElementInteractive(tab as HTMLElement)) {
        return { success: false, message: `Aba "${tab.textContent}" não é interativa` };
      }
    }
    
    // Verifica se o conteúdo correto é exibido ao clicar nas abas
    let allTabsWorkCorrectly = true;
    let failedTab = "";
    
    for (const tab of tabTriggers) {
      (tab as HTMLElement).click();
      const tabId = tab.getAttribute('data-value');
      const matchingContent = Array.from(tabContents).find(
        content => content.getAttribute('data-value') === tabId
      );
      
      if (!matchingContent || matchingContent.getAttribute('data-state') !== 'active') {
        allTabsWorkCorrectly = false;
        failedTab = tab.textContent || "";
        break;
      }
    }
    
    if (!allTabsWorkCorrectly) {
      return { success: false, message: `Falha na exibição do conteúdo da aba "${failedTab}"` };
    }
    
    return { success: true, message: "Navegação entre abas funcionando corretamente" };
  } catch (error) {
    return { success: false, message: `Erro ao testar navegação: ${error}` };
  }
};

// Testa os formulários
export const testFormInteractions = (): { success: boolean; message: string } => {
  try {
    // Testa campos de texto
    const textInputs = document.querySelectorAll('input[type="text"]');
    if (textInputs.length === 0) {
      return { success: false, message: "Nenhum campo de texto encontrado" };
    }
    
    // Testa campos select
    const selects = document.querySelectorAll('[role="combobox"]');
    if (selects.length === 0) {
      return { success: false, message: "Nenhum campo de seleção encontrado" };
    }
    
    // Testa switches
    const switches = document.querySelectorAll('[role="switch"]');
    
    // Testa áreas de texto
    const textareas = document.querySelectorAll('textarea');
    
    return { 
      success: true, 
      message: `Encontrados ${textInputs.length} campos de texto, ${selects.length} selects, ${switches.length} switches e ${textareas.length} áreas de texto` 
    };
  } catch (error) {
    return { success: false, message: `Erro ao testar formulários: ${error}` };
  }
};

// Testa botões
export const testButtonInteractions = (): { success: boolean; message: string } => {
  try {
    const buttons = document.querySelectorAll('button');
    if (buttons.length === 0) {
      return { success: false, message: "Nenhum botão encontrado" };
    }
    
    const interactiveButtons = Array.from(buttons).filter(
      button => isElementInteractive(button as HTMLElement)
    );
    
    if (interactiveButtons.length === 0) {
      return { success: false, message: "Nenhum botão interativo encontrado" };
    }
    
    // Verifica botões específicos
    const saveButton = Array.from(buttons).find(btn => 
      btn.textContent?.includes("Salvar Alterações")
    );
    
    const cancelButton = Array.from(buttons).find(btn => 
      btn.textContent?.includes("Cancelar")
    );
    
    if (!saveButton) {
      return { success: false, message: "Botão 'Salvar Alterações' não encontrado" };
    }
    
    if (!cancelButton) {
      return { success: false, message: "Botão 'Cancelar' não encontrado" };
    }
    
    return { 
      success: true, 
      message: `Encontrados ${interactiveButtons.length} botões interativos, incluindo Salvar e Cancelar` 
    };
  } catch (error) {
    return { success: false, message: `Erro ao testar botões: ${error}` };
  }
};

// Testa o layout responsivo
export const testResponsiveLayout = (): { success: boolean; message: string } => {
  try {
    const tabRows = document.querySelectorAll('[role="tablist"]');
    if (tabRows.length < 2) {
      return { success: false, message: "As abas não estão organizadas em duas linhas" };
    }
    
    // Verifica as grids responsivas
    const grids = document.querySelectorAll('.grid-cols-1.md\\:grid-cols-2');
    if (grids.length === 0) {
      return { success: false, message: "Nenhum layout de grid responsivo encontrado" };
    }
    
    return { 
      success: true, 
      message: `Layout responsivo com ${tabRows.length} linhas de abas e ${grids.length} grids responsivas` 
    };
  } catch (error) {
    return { success: false, message: `Erro ao testar layout responsivo: ${error}` };
  }
};

// Execute todos os testes
export const runAllTests = (): { [key: string]: { success: boolean; message: string } } => {
  return {
    tabNavigation: testTabNavigation(),
    formInteractions: testFormInteractions(),
    buttonInteractions: testButtonInteractions(),
    responsiveLayout: testResponsiveLayout()
  };
};

// Função para exibir no console os resultados dos testes
export const logTestResults = () => {
  const results = runAllTests();
  
  console.log("%c=== RESULTADOS DOS TESTES ===", "font-weight: bold; font-size: 16px; color: blue;");
  
  for (const [testName, result] of Object.entries(results)) {
    if (result.success) {
      console.log(
        `%c✅ ${testName}: ${result.message}`, 
        "color: green; font-weight: bold;"
      );
    } else {
      console.log(
        `%c❌ ${testName}: ${result.message}`, 
        "color: red; font-weight: bold;"
      );
    }
  }
  
  // Contagem de resultados
  const successCount = Object.values(results).filter(r => r.success).length;
  const totalCount = Object.values(results).length;
  
  console.log(
    `%c=== ${successCount}/${totalCount} TESTES PASSARAM ===`, 
    `font-weight: bold; font-size: 16px; color: ${successCount === totalCount ? 'green' : 'orange'};`
  );
  
  return results;
};
