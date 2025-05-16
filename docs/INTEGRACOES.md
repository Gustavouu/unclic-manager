# Análise de Integrações

## 1. Integrações Externas

### 1.1 Supabase Auth
```typescript
// Exemplo de configuração do Supabase Auth
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Exemplo de autenticação
const auth = {
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },
  
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },
  
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};
```

### 1.2 EFI Pay
```typescript
// Exemplo de integração com EFI Pay
const efiPay = new EfiPay({
  client_id: process.env.EFI_CLIENT_ID,
  client_secret: process.env.EFI_CLIENT_SECRET,
  sandbox: process.env.NODE_ENV !== 'production'
});

// Exemplo de pagamento
const payment = {
  create: async (data: PaymentData) => {
    const body = {
      calendario: {
        expiracao: 3600
      },
      devedor: {
        cpf: data.cpf,
        nome: data.name
      },
      valor: {
        original: data.amount.toFixed(2)
      },
      chave: process.env.EFI_PIX_KEY,
      solicitacaoPagador: data.description
    };
    
    const response = await efiPay.pixCreateImmediateCharge([], body);
    return response;
  },
  
  getStatus: async (txid: string) => {
    const response = await efiPay.pixDetailCharge({
      txid
    });
    return response;
  }
};
```

### 1.3 Google Calendar
```typescript
// Exemplo de integração com Google Calendar
const calendar = google.calendar('v3');

// Exemplo de operações com calendário
const googleCalendar = {
  createEvent: async (data: CalendarEvent) => {
    const event = {
      summary: data.title,
      description: data.description,
      start: {
        dateTime: data.startTime,
        timeZone: 'America/Sao_Paulo'
      },
      end: {
        dateTime: data.endTime,
        timeZone: 'America/Sao_Paulo'
      },
      attendees: data.attendees
    };
    
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event
    });
    
    return response.data;
  },
  
  updateEvent: async (eventId: string, data: CalendarEvent) => {
    const event = {
      summary: data.title,
      description: data.description,
      start: {
        dateTime: data.startTime,
        timeZone: 'America/Sao_Paulo'
      },
      end: {
        dateTime: data.endTime,
        timeZone: 'America/Sao_Paulo'
      },
      attendees: data.attendees
    };
    
    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId,
      requestBody: event
    });
    
    return response.data;
  },
  
  deleteEvent: async (eventId: string) => {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId
    });
  }
};
```

### 1.4 WhatsApp Business API
```typescript
// Exemplo de integração com WhatsApp Business API
const whatsapp = {
  sendMessage: async (to: string, message: string) => {
    const response = await axios.post(
      `https://graph.facebook.com/v13.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: {
          body: message
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`
        }
      }
    );
    
    return response.data;
  },
  
  sendTemplate: async (to: string, template: string, params: string[]) => {
    const response = await axios.post(
      `https://graph.facebook.com/v13.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: template,
          language: {
            code: 'pt_BR'
          },
          components: [
            {
              type: 'body',
              parameters: params.map(param => ({
                type: 'text',
                text: param
              }))
            }
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`
        }
      }
    );
    
    return response.data;
  }
};
```

## 2. Integrações Internas

### 2.1 Serviços
```typescript
// Exemplo de serviços internos
const services = {
  auth: {
    validateToken: async (token: string) => {
      const { data, error } = await supabase.auth.getUser(token);
      if (error) throw error;
      return data;
    }
  },
  
  business: {
    create: async (data: BusinessData) => {
      const { data: business, error } = await supabase
        .from('businesses')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return business;
    },
    
    update: async (id: string, data: Partial<BusinessData>) => {
      const { data: business, error } = await supabase
        .from('businesses')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return business;
    }
  },
  
  appointment: {
    create: async (data: AppointmentData) => {
      const { data: appointment, error } = await supabase
        .from('appointments')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return appointment;
    },
    
    update: async (id: string, data: Partial<AppointmentData>) => {
      const { data: appointment, error } = await supabase
        .from('appointments')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return appointment;
    }
  }
};
```

### 2.2 Hooks
```typescript
// Exemplo de hooks customizados
const hooks = {
  useAuth: () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );
      
      return () => subscription.unsubscribe();
    }, []);
    
    return { user, loading };
  },
  
  useBusiness: (id: string) => {
    const [business, setBusiness] = useState<Business | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      const fetchBusiness = async () => {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setBusiness(data);
        setLoading(false);
      };
      
      fetchBusiness();
    }, [id]);
    
    return { business, loading };
  }
};
```

## 3. Plano de Melhorias

### 3.1 Curto Prazo
1. Implementar autenticação
2. Configurar pagamentos
3. Integrar calendário
4. Configurar WhatsApp

### 3.2 Médio Prazo
1. Melhorar serviços
2. Adicionar hooks
3. Otimizar integrações
4. Implementar cache

### 3.3 Longo Prazo
1. Adicionar novas integrações
2. Melhorar performance
3. Implementar analytics
4. Otimizar escalabilidade

## 4. Conclusão

As integrações são componentes essenciais do UnCliC Manager. As integrações externas e internas implementadas visam proporcionar uma experiência completa e integrada para o sistema.

O plano de melhorias estabelecido permitirá evoluir continuamente as integrações, garantindo que elas continuem atendendo às necessidades do sistema de forma eficiente e segura. 