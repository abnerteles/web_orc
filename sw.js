// Service Worker para Sistema de Gestão de Orçamentos
const CACHE_NAME = 'orcamentos-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Recursos para cache estático
const STATIC_ASSETS = [
    './Orçamento.html',
    './index.html',
    './manifest.json',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js'
];

// URLs que devem sempre buscar da rede
const NETWORK_FIRST = [
    '/api/',
    '/data/'
];

// URLs que podem funcionar offline
const CACHE_FIRST = [
    '.css',
    '.js',
    '.woff',
    '.woff2',
    '.ttf',
    '.eot',
    '.ico',
    '.png',
    '.jpg',
    '.jpeg',
    '.svg',
    '.gif'
];

// Instalar Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker: Instalando...');
    
    event.waitUntil(
        Promise.all([
            // Cache estático
            caches.open(STATIC_CACHE).then(cache => {
                console.log('Service Worker: Fazendo cache dos recursos estáticos');
                return cache.addAll(STATIC_ASSETS);
            }),
            
            // Cache dinâmico inicial
            caches.open(DYNAMIC_CACHE).then(cache => {
                console.log('Service Worker: Cache dinâmico criado');
                return cache.put('/offline.html', new Response(`
                    <!DOCTYPE html>
                    <html lang="pt-BR">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Offline - Sistema de Orçamentos</title>
                        <style>
                            body {
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                min-height: 100vh;
                                margin: 0;
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                color: white;
                                text-align: center;
                            }
                            .offline-container {
                                max-width: 400px;
                                padding: 2rem;
                                background: rgba(255,255,255,0.1);
                                border-radius: 1rem;
                                backdrop-filter: blur(10px);
                            }
                            .offline-icon {
                                font-size: 4rem;
                                margin-bottom: 1rem;
                            }
                            .retry-btn {
                                background: #2563eb;
                                color: white;
                                border: none;
                                padding: 0.75rem 1.5rem;
                                border-radius: 0.5rem;
                                cursor: pointer;
                                margin-top: 1rem;
                                font-size: 1rem;
                            }
                            .retry-btn:hover {
                                background: #1d4ed8;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="offline-container">
                            <div class="offline-icon">📱</div>
                            <h1>Você está offline</h1>
                            <p>Não foi possível conectar à internet. Algumas funcionalidades podem estar limitadas.</p>
                            <p>Os dados salvos localmente ainda estão disponíveis.</p>
                            <button class="retry-btn" onclick="window.location.reload()">
                                Tentar novamente
                            </button>
                        </div>
                    </body>
                    </html>
                `, {
                    headers: { 'Content-Type': 'text/html' }
                }));
            })
        ]).then(() => {
            console.log('Service Worker: Instalação concluída');
            return self.skipWaiting();
        })
    );
});

// Ativar Service Worker
self.addEventListener('activate', event => {
    console.log('Service Worker: Ativando...');
    
    event.waitUntil(
        Promise.all([
            // Limpar caches antigos
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName !== CACHE_NAME) {
                            console.log('Service Worker: Removendo cache antigo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            
            // Assumir controle de todas as abas
            self.clients.claim()
        ]).then(() => {
            console.log('Service Worker: Ativação concluída');
        })
    );
});

// Interceptar requisições
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Ignorar requisições não-HTTP
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // Estratégia baseada no tipo de recurso
    if (isNetworkFirst(request.url)) {
        event.respondWith(networkFirst(request));
    } else if (isCacheFirst(request.url)) {
        event.respondWith(cacheFirst(request));
    } else {
        event.respondWith(staleWhileRevalidate(request));
    }
});

// Estratégia Network First (rede primeiro)
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', request.url);
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Se for uma navegação e não há cache, mostrar página offline
        if (request.mode === 'navigate') {
            return caches.match('/offline.html');
        }
        
        throw error;
    }
}

// Estratégia Cache First (cache primeiro)
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Failed to fetch:', request.url);
        throw error;
    }
}

// Estratégia Stale While Revalidate
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(error => {
        console.log('Network failed for:', request.url);
        return null;
    });
    
    // Retornar cache imediatamente se disponível, senão aguardar rede
    if (cachedResponse) {
        fetchPromise; // Atualizar cache em background
        return cachedResponse;
    }
    
    const networkResponse = await fetchPromise;
    if (networkResponse) {
        return networkResponse;
    }
    
    // Fallback para página offline se for navegação
    if (request.mode === 'navigate') {
        return caches.match('/offline.html');
    }
    
    throw new Error('No response available');
}

// Verificar se deve usar Network First
function isNetworkFirst(url) {
    return NETWORK_FIRST.some(pattern => url.includes(pattern));
}

// Verificar se deve usar Cache First
function isCacheFirst(url) {
    return CACHE_FIRST.some(extension => url.includes(extension));
}

// Sincronização em background
self.addEventListener('sync', event => {
    console.log('Service Worker: Sincronização em background:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

// Executar sincronização em background
async function doBackgroundSync() {
    try {
        // Sincronizar dados pendentes
        const pendingData = await getStoredData('pendingSync');
        
        if (pendingData && pendingData.length > 0) {
            for (const item of pendingData) {
                try {
                    await syncDataItem(item);
                    await removeFromPendingSync(item.id);
                } catch (error) {
                    console.log('Falha ao sincronizar item:', item.id, error);
                }
            }
        }
        
        console.log('Sincronização em background concluída');
    } catch (error) {
        console.log('Erro na sincronização em background:', error);
    }
}

// Obter dados armazenados
async function getStoredData(key) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const response = await cache.match(`/storage/${key}`);
        
        if (response) {
            return await response.json();
        }
        
        return null;
    } catch (error) {
        console.log('Erro ao obter dados armazenados:', error);
        return null;
    }
}

// Sincronizar item de dados
async function syncDataItem(item) {
    const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    });
    
    if (!response.ok) {
        throw new Error(`Sync failed: ${response.status}`);
    }
    
    return response.json();
}

// Remover item da sincronização pendente
async function removeFromPendingSync(itemId) {
    try {
        const pendingData = await getStoredData('pendingSync') || [];
        const updatedData = pendingData.filter(item => item.id !== itemId);
        
        const cache = await caches.open(DYNAMIC_CACHE);
        await cache.put(`/storage/pendingSync`, new Response(
            JSON.stringify(updatedData),
            { headers: { 'Content-Type': 'application/json' } }
        ));
    } catch (error) {
        console.log('Erro ao remover item da sincronização:', error);
    }
}

// Notificações push
self.addEventListener('push', event => {
    console.log('Service Worker: Notificação push recebida');
    
    const options = {
        body: 'Você tem novas atualizações no sistema de orçamentos',
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver detalhes',
                icon: '/icon-explore.png'
            },
            {
                action: 'close',
                title: 'Fechar',
                icon: '/icon-close.png'
            }
        ]
    };
    
    if (event.data) {
        const data = event.data.json();
        options.body = data.body || options.body;
        options.title = data.title || 'Sistema de Orçamentos';
    }
    
    event.waitUntil(
        self.registration.showNotification('Sistema de Orçamentos', options)
    );
});

// Clique em notificação
self.addEventListener('notificationclick', event => {
    console.log('Service Worker: Clique em notificação');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/Orçamento.html')
        );
    } else if (event.action === 'close') {
        // Apenas fechar a notificação
    } else {
        // Clique na notificação principal
        event.waitUntil(
            clients.matchAll().then(clientList => {
                if (clientList.length > 0) {
                    return clientList[0].focus();
                }
                return clients.openWindow('/Orçamento.html');
            })
        );
    }
});

// Mensagens do cliente
self.addEventListener('message', event => {
    console.log('Service Worker: Mensagem recebida:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

console.log('Service Worker: Script carregado');