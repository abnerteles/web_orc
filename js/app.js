// Sistema de Gestão de Orçamentos
class BudgetManager {
    constructor() {
        this.budgets = JSON.parse(localStorage.getItem('budgets')) || [];
        this.clients = JSON.parse(localStorage.getItem('clients')) || [];
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboard();
        this.updateStats();
        
        // Dados de exemplo se não houver dados salvos
        if (this.budgets.length === 0) {
            this.loadSampleData();
        }
    }

    setupEventListeners() {
        // Navegação
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.closest('.nav-btn').dataset.section;
                this.showSection(section);
            });
        });

        // Modal
        const modalOverlay = document.getElementById('modal-overlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === e.currentTarget) {
                    this.closeModal();
                }
            });
        }

        const modalClose = document.getElementById('modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Botões de ação
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-new-budget') || e.target.id === 'novo-orcamento-btn') {
                this.openBudgetModal();
            } else if (e.target.matches('.btn-new-client') || e.target.id === 'novo-cliente-btn') {
                this.openClientModal();
            } else if (e.target.matches('.action-btn.edit')) {
                const id = e.target.dataset.id;
                const type = e.target.dataset.type;
                if (type === 'budget') {
                    this.editBudget(id);
                } else if (type === 'client') {
                    this.editClient(id);
                }
            } else if (e.target.matches('.action-btn.delete')) {
                const id = e.target.dataset.id;
                const type = e.target.dataset.type;
                if (type === 'budget') {
                    this.deleteBudget(id);
                } else if (type === 'client') {
                    this.deleteClient(id);
                }
            } else if (e.target.matches('.action-btn.view')) {
                const id = e.target.dataset.id;
                this.viewBudget(id);
            }
        });

        // Formulários
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'budgetForm') {
                e.preventDefault();
                this.saveBudget();
            } else if (e.target.id === 'clientForm') {
                e.preventDefault();
                this.saveClient();
            }
        });
    }

    showSection(sectionName) {
        // Atualizar navegação
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Mostrar seção
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');

        this.currentSection = sectionName;

        // Carregar dados da seção
        switch (sectionName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'budgets':
                this.loadBudgets();
                break;
            case 'clients':
                this.loadClients();
                break;
            case 'reports':
                this.loadReports();
                break;
        }
    }

    loadDashboard() {
        this.updateStats();
        this.loadRecentActivity();
    }

    updateStats() {
        // Verificar se os elementos existem
        const elements = {
            totalBudgets: document.getElementById('total-orcamentos'),
            approvedBudgets: document.getElementById('orcamentos-aprovados'),
            totalValue: document.getElementById('valor-total'),
            totalClients: document.getElementById('total-clientes')
        };
        
        // Só atualizar se todos os elementos existirem
        if (elements.totalBudgets && elements.approvedBudgets && elements.totalValue && elements.totalClients) {
            const totalBudgets = this.budgets.length;
            const approvedBudgets = this.budgets.filter(b => b.status === 'aprovado').length;
            const totalValue = this.budgets
                .filter(b => b.status === 'aprovado')
                .reduce((sum, b) => sum + parseFloat(b.value), 0);
            const totalClients = this.clients.length;

            elements.totalBudgets.textContent = totalBudgets;
            elements.approvedBudgets.textContent = approvedBudgets;
            elements.totalValue.textContent = this.formatCurrency(totalValue);
            elements.totalClients.textContent = totalClients;
        }
    }

    loadRecentActivity() {
        const recentBudgets = this.budgets
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        const activityList = document.getElementById('recent-list');
        
        if (recentBudgets.length === 0) {
            activityList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>Nenhuma atividade recente</p>
                </div>
            `;
            return;
        }

        activityList.innerHTML = recentBudgets.map(budget => {
            const client = this.clients.find(c => c.id === budget.clientId);
            const clientName = client ? client.name : 'Cliente não encontrado';
            
            return `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-file-invoice-dollar"></i>
                    </div>
                    <div class="activity-content">
                        <h4>Orçamento #${budget.id}</h4>
                        <p>Cliente: ${clientName} - ${this.formatCurrency(budget.value)}</p>
                    </div>
                    <div class="activity-time">
                        ${this.formatDate(budget.createdAt)}
                    </div>
                </div>
            `;
        }).join('');
    }

    loadBudgets() {
        const budgetsTable = document.getElementById('orcamentos-table');
        
        if (this.budgets.length === 0) {
            budgetsTable.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-invoice"></i>
                    <p>Nenhum orçamento encontrado</p>
                    <button class="btn btn-primary btn-new-budget">
                        <i class="fas fa-plus"></i>
                        Criar Primeiro Orçamento
                    </button>
                </div>
            `;
            return;
        }

        const tableHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Status</th>
                        <th>Data</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.budgets.map(budget => {
                        const client = this.clients.find(c => c.id === budget.clientId);
                        const clientName = client ? client.name : 'Cliente não encontrado';
                        
                        return `
                            <tr>
                                <td>#${budget.id}</td>
                                <td>${clientName}</td>
                                <td>${budget.description}</td>
                                <td>${this.formatCurrency(budget.value)}</td>
                                <td>
                                    <span class="status-badge status-${budget.status}">
                                        ${this.getStatusText(budget.status)}
                                    </span>
                                </td>
                                <td>${this.formatDate(budget.createdAt)}</td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="action-btn view" data-id="${budget.id}" title="Visualizar">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="action-btn edit" data-id="${budget.id}" data-type="budget" title="Editar">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="action-btn delete" data-id="${budget.id}" data-type="budget" title="Excluir">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;

        budgetsTable.innerHTML = tableHTML;
    }

    loadClients() {
        const clientsTable = document.getElementById('clientes-table');
        
        if (this.clients.length === 0) {
            clientsTable.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <p>Nenhum cliente encontrado</p>
                    <button class="btn btn-primary btn-new-client">
                        <i class="fas fa-plus"></i>
                        Adicionar Primeiro Cliente
                    </button>
                </div>
            `;
            return;
        }

        const tableHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Empresa</th>
                        <th>Orçamentos</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.clients.map(client => {
                        const clientBudgets = this.budgets.filter(b => b.clientId === client.id);
                        
                        return `
                            <tr>
                                <td>${client.name}</td>
                                <td>${client.email}</td>
                                <td>${client.phone}</td>
                                <td>${client.company || '-'}</td>
                                <td>${clientBudgets.length}</td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="action-btn edit" data-id="${client.id}" data-type="client" title="Editar">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="action-btn delete" data-id="${client.id}" data-type="client" title="Excluir">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;

        clientsTable.innerHTML = tableHTML;
    }

    loadReports() {
        this.loadBudgetChart();
        this.loadStatusChart();
    }

    loadBudgetChart() {
        const ctx = document.getElementById('revenue-chart');
        if (!ctx) return;

        const monthlyData = this.getMonthlyBudgetData();
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthlyData.labels,
                datasets: [{
                    label: 'Faturamento por Mês',
                    data: monthlyData.values,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Faturamento Mensal'
                    }
                }
            }
        });
    }

    loadStatusChart() {
        const ctx = document.getElementById('status-chart');
        if (!ctx) return;

        const statusData = this.getStatusData();
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Pendente', 'Aprovado', 'Rejeitado'],
                datasets: [{
                    data: [statusData.pendente, statusData.aprovado, statusData.rejeitado],
                    backgroundColor: ['#f59e0b', '#10b981', '#ef4444']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Status dos Orçamentos'
                    }
                }
            }
        });
    }

    openBudgetModal(budgetId = null) {
        const modal = document.getElementById('modal-overlay');
        const modalTitle = document.querySelector('.modal-header h3');
        const form = document.getElementById('budgetForm');
        
        modalTitle.textContent = budgetId ? 'Editar Orçamento' : 'Novo Orçamento';
        
        // Carregar clientes no select
        const clientSelect = document.getElementById('budgetClient');
        clientSelect.innerHTML = '<option value="">Selecione um cliente</option>' +
            this.clients.map(client => 
                `<option value="${client.id}">${client.name}</option>`
            ).join('');

        if (budgetId) {
            const budget = this.budgets.find(b => b.id === budgetId);
            if (budget) {
                document.getElementById('budgetId').value = budget.id;
                document.getElementById('budgetClient').value = budget.clientId;
                document.getElementById('budgetDescription').value = budget.description;
                document.getElementById('budgetValue').value = budget.value;
                document.getElementById('budgetStatus').value = budget.status;
                document.getElementById('budgetNotes').value = budget.notes || '';
            }
        } else {
            form.reset();
            document.getElementById('budgetId').value = '';
        }

        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>${budgetId ? 'Editar Orçamento' : 'Novo Orçamento'}</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="budgetForm">
                        <input type="hidden" id="budgetId" value="${budgetId || ''}">
                        
                        <div class="form-group">
                            <label class="form-label" for="budgetClient">Cliente</label>
                            <select id="budgetClient" class="form-select" required>
                                <option value="">Selecione um cliente</option>
                                ${this.clients.map(client => 
                                    `<option value="${client.id}">${client.name}</option>`
                                ).join('')}
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="budgetDescription">Descrição</label>
                            <textarea id="budgetDescription" class="form-input form-textarea" required placeholder="Descreva o projeto ou serviço"></textarea>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="budgetValue">Valor (R$)</label>
                            <input type="number" id="budgetValue" class="form-input" step="0.01" min="0" required placeholder="0,00">
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="budgetStatus">Status</label>
                            <select id="budgetStatus" class="form-select" required>
                                <option value="pendente">Pendente</option>
                                <option value="aprovado">Aprovado</option>
                                <option value="rejeitado">Rejeitado</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="budgetNotes">Observações</label>
                            <textarea id="budgetNotes" class="form-input form-textarea" placeholder="Observações adicionais (opcional)"></textarea>
                        </div>

                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary modal-close">Cancelar</button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i>
                                ${budgetId ? 'Atualizar' : 'Salvar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Reconfigurar event listeners do modal
        modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        modal.querySelector('#budgetForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveBudget();
        });

        if (budgetId) {
            const budget = this.budgets.find(b => b.id === budgetId);
            if (budget) {
                modal.querySelector('#budgetClient').value = budget.clientId;
                modal.querySelector('#budgetDescription').value = budget.description;
                modal.querySelector('#budgetValue').value = budget.value;
                modal.querySelector('#budgetStatus').value = budget.status;
                modal.querySelector('#budgetNotes').value = budget.notes || '';
            }
        }

        modal.classList.add('active');
    }

    openClientModal(clientId = null) {
        const modal = document.getElementById('modal-overlay');
        
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>${clientId ? 'Editar Cliente' : 'Novo Cliente'}</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="clientForm">
                        <input type="hidden" id="clientId" value="${clientId || ''}">
                        
                        <div class="form-group">
                            <label class="form-label" for="clientName">Nome</label>
                            <input type="text" id="clientName" class="form-input" required placeholder="Nome completo">
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="clientEmail">Email</label>
                            <input type="email" id="clientEmail" class="form-input" required placeholder="email@exemplo.com">
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="clientPhone">Telefone</label>
                            <input type="tel" id="clientPhone" class="form-input" required placeholder="(11) 99999-9999">
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="clientCompany">Empresa</label>
                            <input type="text" id="clientCompany" class="form-input" placeholder="Nome da empresa (opcional)">
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="clientAddress">Endereço</label>
                            <textarea id="clientAddress" class="form-input form-textarea" placeholder="Endereço completo (opcional)"></textarea>
                        </div>

                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary modal-close">Cancelar</button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i>
                                ${clientId ? 'Atualizar' : 'Salvar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Configurar event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        modal.querySelector('#clientForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveClient();
        });

        if (clientId) {
            const client = this.clients.find(c => c.id === clientId);
            if (client) {
                modal.querySelector('#clientName').value = client.name;
                modal.querySelector('#clientEmail').value = client.email;
                modal.querySelector('#clientPhone').value = client.phone;
                modal.querySelector('#clientCompany').value = client.company || '';
                modal.querySelector('#clientAddress').value = client.address || '';
            }
        }

        modal.classList.add('active');
    }

    saveBudget() {
        const form = document.getElementById('budgetForm');
        const formData = new FormData(form);
        
        const budgetData = {
            id: document.getElementById('budgetId').value || this.generateId(),
            clientId: document.getElementById('budgetClient').value,
            description: document.getElementById('budgetDescription').value,
            value: parseFloat(document.getElementById('budgetValue').value),
            status: document.getElementById('budgetStatus').value,
            notes: document.getElementById('budgetNotes').value,
            createdAt: document.getElementById('budgetId').value ? 
                this.budgets.find(b => b.id === document.getElementById('budgetId').value)?.createdAt : 
                new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const existingIndex = this.budgets.findIndex(b => b.id === budgetData.id);
        
        if (existingIndex >= 0) {
            this.budgets[existingIndex] = budgetData;
        } else {
            this.budgets.push(budgetData);
        }

        this.saveToStorage();
        this.closeModal();
        this.updateStats();
        
        if (this.currentSection === 'budgets') {
            this.loadBudgets();
        } else if (this.currentSection === 'dashboard') {
            this.loadRecentActivity();
        }

        this.showNotification('Orçamento salvo com sucesso!', 'success');
    }

    saveClient() {
        const clientData = {
            id: document.getElementById('clientId').value || this.generateId(),
            name: document.getElementById('clientName').value,
            email: document.getElementById('clientEmail').value,
            phone: document.getElementById('clientPhone').value,
            company: document.getElementById('clientCompany').value,
            address: document.getElementById('clientAddress').value,
            createdAt: document.getElementById('clientId').value ? 
                this.clients.find(c => c.id === document.getElementById('clientId').value)?.createdAt : 
                new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const existingIndex = this.clients.findIndex(c => c.id === clientData.id);
        
        if (existingIndex >= 0) {
            this.clients[existingIndex] = clientData;
        } else {
            this.clients.push(clientData);
        }

        this.saveToStorage();
        this.closeModal();
        
        if (this.currentSection === 'clients') {
            this.loadClients();
        }

        this.showNotification('Cliente salvo com sucesso!', 'success');
    }

    editBudget(id) {
        this.openBudgetModal(id);
    }

    editClient(id) {
        this.openClientModal(id);
    }

    deleteBudget(id) {
        if (confirm('Tem certeza que deseja excluir este orçamento?')) {
            this.budgets = this.budgets.filter(b => b.id !== id);
            this.saveToStorage();
            this.updateStats();
            
            if (this.currentSection === 'budgets') {
                this.loadBudgets();
            } else if (this.currentSection === 'dashboard') {
                this.loadRecentActivity();
            }

            this.showNotification('Orçamento excluído com sucesso!', 'success');
        }
    }

    deleteClient(id) {
        const clientBudgets = this.budgets.filter(b => b.clientId === id);
        
        if (clientBudgets.length > 0) {
            alert('Não é possível excluir este cliente pois ele possui orçamentos associados.');
            return;
        }

        if (confirm('Tem certeza que deseja excluir este cliente?')) {
            this.clients = this.clients.filter(c => c.id !== id);
            this.saveToStorage();
            
            if (this.currentSection === 'clients') {
                this.loadClients();
            }

            this.showNotification('Cliente excluído com sucesso!', 'success');
        }
    }

    viewBudget(id) {
        const budget = this.budgets.find(b => b.id === id);
        const client = this.clients.find(c => c.id === budget.clientId);
        
        if (!budget) return;

        const modal = document.getElementById('modal-overlay');
        
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>Orçamento #${budget.id}</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="budget-details">
                        <div class="form-group">
                            <label class="form-label">Cliente</label>
                            <p>${client ? client.name : 'Cliente não encontrado'}</p>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Descrição</label>
                            <p>${budget.description}</p>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Valor</label>
                            <p>${this.formatCurrency(budget.value)}</p>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Status</label>
                            <p>
                                <span class="status-badge status-${budget.status}">
                                    ${this.getStatusText(budget.status)}
                                </span>
                            </p>
                        </div>

                        ${budget.notes ? `
                            <div class="form-group">
                                <label class="form-label">Observações</label>
                                <p>${budget.notes}</p>
                            </div>
                        ` : ''}

                        <div class="form-group">
                            <label class="form-label">Data de Criação</label>
                            <p>${this.formatDate(budget.createdAt)}</p>
                        </div>

                        ${budget.updatedAt !== budget.createdAt ? `
                            <div class="form-group">
                                <label class="form-label">Última Atualização</label>
                                <p>${this.formatDate(budget.updatedAt)}</p>
                            </div>
                        ` : ''}
                    </div>

                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary modal-close">Fechar</button>
                        <button type="button" class="btn btn-primary" onclick="budgetManager.editBudget('${budget.id}')">
                            <i class="fas fa-edit"></i>
                            Editar
                        </button>
                    </div>
                </div>
            </div>
        `;

        modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        modal.classList.add('active');
    }

    closeModal() {
        const modal = document.getElementById('modal-overlay');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // Métodos utilitários
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('pt-BR');
    }

    getStatusText(status) {
        const statusMap = {
            'pendente': 'Pendente',
            'aprovado': 'Aprovado',
            'rejeitado': 'Rejeitado'
        };
        return statusMap[status] || status;
    }

    getMonthlyBudgetData() {
        const months = {};
        
        this.budgets.forEach(budget => {
            const date = new Date(budget.createdAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            months[monthKey] = (months[monthKey] || 0) + 1;
        });

        const sortedMonths = Object.keys(months).sort();
        
        return {
            labels: sortedMonths.map(month => {
                const [year, monthNum] = month.split('-');
                return new Date(year, monthNum - 1).toLocaleDateString('pt-BR', { 
                    month: 'short', 
                    year: 'numeric' 
                });
            }),
            values: sortedMonths.map(month => months[month])
        };
    }

    getStatusData() {
        return {
            pendente: this.budgets.filter(b => b.status === 'pendente').length,
            aprovado: this.budgets.filter(b => b.status === 'aprovado').length,
            rejeitado: this.budgets.filter(b => b.status === 'rejeitado').length
        };
    }

    saveToStorage() {
        localStorage.setItem('budgets', JSON.stringify(this.budgets));
        localStorage.setItem('clients', JSON.stringify(this.clients));
    }

    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Adicionar estilos se não existirem
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 0.5rem;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    z-index: 1001;
                    animation: slideIn 0.3s ease-out;
                }
                .notification-success { background: var(--success-color); }
                .notification-info { background: var(--primary-color); }
                .notification-warning { background: var(--warning-color); }
                .notification-error { background: var(--danger-color); }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Remover após 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    loadSampleData() {
        // Dados de exemplo
        this.clients = [
            {
                id: 'client1',
                name: 'João Silva',
                email: 'joao@email.com',
                phone: '(11) 99999-9999',
                company: 'Silva & Associados',
                address: 'Rua das Flores, 123 - São Paulo, SP',
                createdAt: new Date('2024-01-15').toISOString(),
                updatedAt: new Date('2024-01-15').toISOString()
            },
            {
                id: 'client2',
                name: 'Maria Santos',
                email: 'maria@email.com',
                phone: '(11) 88888-8888',
                company: 'Santos Ltda',
                address: 'Av. Principal, 456 - São Paulo, SP',
                createdAt: new Date('2024-01-20').toISOString(),
                updatedAt: new Date('2024-01-20').toISOString()
            },
            {
                id: 'client3',
                name: 'Pedro Costa',
                email: 'pedro@email.com',
                phone: '(11) 77777-7777',
                company: '',
                address: '',
                createdAt: new Date('2024-02-01').toISOString(),
                updatedAt: new Date('2024-02-01').toISOString()
            }
        ];

        this.budgets = [
            {
                id: 'budget1',
                clientId: 'client1',
                description: 'Desenvolvimento de website institucional',
                value: 5000.00,
                status: 'aprovado',
                notes: 'Projeto aprovado pelo cliente',
                createdAt: new Date('2024-01-16').toISOString(),
                updatedAt: new Date('2024-01-18').toISOString()
            },
            {
                id: 'budget2',
                clientId: 'client2',
                description: 'Sistema de gestão de estoque',
                value: 12000.00,
                status: 'pendente',
                notes: 'Aguardando aprovação da diretoria',
                createdAt: new Date('2024-01-25').toISOString(),
                updatedAt: new Date('2024-01-25').toISOString()
            },
            {
                id: 'budget3',
                clientId: 'client3',
                description: 'Aplicativo mobile para delivery',
                value: 8500.00,
                status: 'rejeitado',
                notes: 'Cliente optou por outra solução',
                createdAt: new Date('2024-02-02').toISOString(),
                updatedAt: new Date('2024-02-05').toISOString()
            },
            {
                id: 'budget4',
                clientId: 'client1',
                description: 'Manutenção e suporte técnico',
                value: 2000.00,
                status: 'aprovado',
                notes: 'Contrato de 6 meses',
                createdAt: new Date('2024-02-10').toISOString(),
                updatedAt: new Date('2024-02-10').toISOString()
            }
        ];

        this.saveToStorage();
    }
}

// Inicializar aplicação
let budgetManager;

document.addEventListener('DOMContentLoaded', () => {
    // Pequeno delay para garantir que todos os elementos estejam disponíveis
    setTimeout(() => {
        budgetManager = new BudgetManager();
    }, 100);
});