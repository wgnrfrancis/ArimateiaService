// Arquivo: FUNCOES_ADICIONAIS_GAS.js
// Funções adicionais para o Google Apps Script
// Adicione essas funções ao seu arquivo Code.gs no Google Apps Script

/**
 * Função para obter regiões e igrejas da aba IGREJAS_REGIOES
 */
function getIgrejasRegioes() {
  try {
    console.log('🔍 Buscando dados da aba IGREJAS_REGIOES...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName('IGREJAS_REGIOES');
    
    if (!sheet) {
      throw new Error('Aba IGREJAS_REGIOES não encontrada');
    }
    
    // Obter todos os dados da planilha (assumindo que a primeira linha são cabeçalhos)
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    if (values.length <= 1) {
      throw new Error('Nenhum dado encontrado na aba IGREJAS_REGIOES');
    }
    
    // Cabeçalhos esperados: NOME_IGREJA, REGIAO
    const headers = values[0];
    const nomeIgrejaIndex = headers.indexOf('NOME_IGREJA');
    const regiaoIndex = headers.indexOf('REGIAO');
    
    if (nomeIgrejaIndex === -1 || regiaoIndex === -1) {
      throw new Error('Colunas NOME_IGREJA e/ou REGIAO não encontradas');
    }
    
    // Processar dados
    const igrejasPorRegiao = {};
    const regioesSet = new Set();
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const nomeIgreja = row[nomeIgrejaIndex];
      const regiao = row[regiaoIndex];
      
      // Pular linhas vazias
      if (!nomeIgreja || !regiao) continue;
      
      regioesSet.add(regiao);
      
      if (!igrejasPorRegiao[regiao]) {
        igrejasPorRegiao[regiao] = [];
      }
      
      igrejasPorRegiao[regiao].push({
        nome: nomeIgreja,
        regiao: regiao
      });
    }
    
    const regioes = Array.from(regioesSet).sort();
    const totalIgrejas = Object.values(igrejasPorRegiao).reduce((total, igrejas) => total + igrejas.length, 0);
    
    console.log(`✅ Encontradas ${regioes.length} regiões e ${totalIgrejas} igrejas`);
    
    return {
      success: true,
      data: {
        regioes: regioes,
        igrejasPorRegiao: igrejasPorRegiao,
        total: {
          regioes: regioes.length,
          igrejas: totalIgrejas
        }
      }
    };
    
  } catch (error) {
    console.error('❌ Erro ao buscar igrejas e regiões:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Função para obter categorias (pode ser de uma aba CATEGORIAS ou fixas)
 */
function getCategories() {
  try {
    // Categorias fixas (você pode implementar busca na planilha se necessário)
    const categorias = [
      'DOCUMENTACAO',
      'JURIDICO',
      'SAUDE',
      'ASSISTENCIA_SOCIAL',
      'EDUCACAO',
      'PREVIDENCIA',
      'TRABALHO',
      'OUTROS'
    ];
    
    return {
      success: true,
      data: categorias
    };
    
  } catch (error) {
    console.error('❌ Erro ao buscar categorias:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Função para obter voluntários (da aba USUARIOS com cargo VOLUNTARIO)
 */
function getVolunteers() {
  try {
    console.log('🔍 Buscando voluntários...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName('USUARIOS');
    
    if (!sheet) {
      throw new Error('Aba USUARIOS não encontrada');
    }
    
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    if (values.length <= 1) {
      return { success: true, data: [] };
    }
    
    const headers = values[0];
    const volunteers = [];
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const userData = {};
      
      headers.forEach((header, index) => {
        userData[header] = row[index];
      });
      
      // Filtrar apenas voluntários
      if (userData.CARGO === 'VOLUNTARIO') {
        volunteers.push({
          nome: userData.NOME_COMPLETO,
          email: userData.EMAIL,
          telefone: userData.TELEFONE,
          igreja: userData.IGREJA,
          regiao: userData.REGIAO
        });
      }
    }
    
    return {
      success: true,
      data: volunteers
    };
    
  } catch (error) {
    console.error('❌ Erro ao buscar voluntários:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Função para obter profissionais (pode ser de uma aba específica ou filtro)
 */
function getProfessionals() {
  try {
    console.log('🔍 Buscando profissionais...');
    
    // Por enquanto retorna array vazio - implementar conforme necessidade
    return {
      success: true,
      data: []
    };
    
  } catch (error) {
    console.error('❌ Erro ao buscar profissionais:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// IMPORTANTE: Adicione essas ações ao switch do doPost() no seu arquivo principal:
/*
case 'getIgrejasRegioes':
  return ContentService.createTextOutput(JSON.stringify(getIgrejasRegioes()))
    .setMimeType(ContentService.MimeType.JSON);

case 'getCategories':
  return ContentService.createTextOutput(JSON.stringify(getCategories()))
    .setMimeType(ContentService.MimeType.JSON);

case 'getVolunteers':
  return ContentService.createTextOutput(JSON.stringify(getVolunteers()))
    .setMimeType(ContentService.MimeType.JSON);

case 'getProfessionals':
  return ContentService.createTextOutput(JSON.stringify(getProfessionals()))
    .setMimeType(ContentService.MimeType.JSON);
*/
