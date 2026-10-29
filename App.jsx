import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Github, 
  Search, 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  ExternalLink, 
  Server, 
  ShieldCheck, 
  Laptop, 
  Smartphone, 
  Terminal,
  Settings,
  ChevronLeft,
  Loader2,
  Sparkles,
  SearchX,
  Clock
} from 'lucide-react';

// --- STRUCTURED MOCK DATA ---
// In a real Next.js app, this would live in a database or static JSON files.
const PROVIDER_DATA = {
  google: {
    id: 'google',
    name: 'Google Workspace',
    icon: Search,
    color: 'text-blue-500',
    docsUrl: 'https://developers.google.com/identity/protocols/oauth2',
    lastVerified: '2023-10-25',
    estimatedTime: '15 mins',
    prerequisites: [
      'A Google Cloud Platform (GCP) account',
      'An active GCP Project'
    ],
    steps: [
      {
        id: 'g1',
        title: 'Create a GCP Project',
        description: 'Go to the Google Cloud Console and create a new project. Note your Project ID.',
        isVerificationRequired: false,
        estimatedTime: '2 mins'
      },
      {
        id: 'g2',
        title: 'Configure OAuth Consent Screen',
        description: 'Navigate to APIs & Services > OAuth consent screen. Choose User Type (Internal or External). You must complete this before creating credentials.',
        isVerificationRequired: true,
        verificationNote: 'External apps requesting sensitive scopes require a security assessment and manual verification by Google, which can take several weeks.',
        estimatedTime: '5 mins'
      },
      {
        id: 'g3',
        title: 'Create OAuth Credentials',
        description: 'Go to Credentials > Create Credentials > OAuth client ID. Select your Application Type.',
        isVerificationRequired: false,
        estimatedTime: '3 mins'
      },
      {
        id: 'g4',
        title: 'Configure Authorized URIs',
        description: 'Add your authorized JavaScript origins (for web apps) and Authorized redirect URIs (e.g., https://yourapp.com/api/auth/callback/google).',
        isVerificationRequired: false,
        estimatedTime: '5 mins'
      }
    ],
    commonScopes: [
      { name: 'openid', description: 'Authenticate the user' },
      { name: 'email', description: 'View the user\'s email address' },
      { name: 'profile', description: 'View the user\'s basic profile info' }
    ],
    troubleshooting: [
      {
        error: 'redirect_uri_mismatch',
        solution: 'The redirect URI in your code does not exactly match the one configured in GCP. Check for trailing slashes, http vs https, and exact paths.'
      },
      {
        error: 'access_denied',
        solution: 'The user canceled the authorization flow or your app is in "Testing" mode and the user is not added to the Test Users list on the Consent Screen.'
      }
    ]
  },
  github: {
    id: 'github',
    name: 'GitHub',
    icon: Github,
    color: 'text-neutral-800 dark:text-neutral-200',
    docsUrl: 'https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app',
    lastVerified: '2023-10-26',
    estimatedTime: '10 mins',
    prerequisites: [
      'A GitHub account',
      '(Optional) An Organization account if creating the app for a team'
    ],
    steps: [
      {
        id: 'gh1',
        title: 'Navigate to Developer Settings',
        description: 'Go to Settings > Developer settings > OAuth Apps > New OAuth App.',
        isVerificationRequired: false,
        estimatedTime: '2 mins'
      },
      {
        id: 'gh2',
        title: 'Register Application',
        description: 'Fill in the Application name, Homepage URL, and Authorization callback URL.',
        isVerificationRequired: false,
        estimatedTime: '5 mins'
      },
      {
        id: 'gh3',
        title: 'Generate Client Secret',
        description: 'Once created, click "Generate a new client secret". Copy it immediately; it will only be shown once.',
        isVerificationRequired: false,
        estimatedTime: '3 mins'
      }
    ],
    commonScopes: [
      { name: '(no scope)', description: 'Grants read-only access to public information' },
      { name: 'user:email', description: 'Read access to user email addresses' },
      { name: 'repo', description: 'Full control of private repositories' }
    ],
    troubleshooting: [
      {
        error: 'The redirect_uri MUST match',
        solution: 'GitHub is very strict about redirect URIs. Ensure the domain and path match exactly what is registered. Localhost is permitted for development.'
      }
    ]
  }
};

// --- UI COMPONENTS ---
const Card = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white border border-slate-200 rounded-xl p-6 shadow-sm transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-md hover:border-slate-300 active:scale-[0.99]' : ''} ${className}`}
  >
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = "button" }) => {
  const base = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 px-5 py-2.5",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 px-5 py-2.5",
    outline: "border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-900 px-5 py-2.5",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600 px-3 py-2"
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

// --- VIEWS ---

const LandingView = ({ onStart }) => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
    <div className="bg-slate-100 p-4 rounded-2xl mb-4">
      <ShieldCheck className="w-12 h-12 text-slate-700" />
    </div>
    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
      OAuth Setup, <span className="text-blue-600">Demystified.</span>
    </h1>
    <p className="text-lg text-slate-600 max-w-xl">
      Stop wasting hours reading scattered documentation. Get tailored, step-by-step instructions for configuring OAuth providers based on your specific application stack.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 pt-4">
      <Button onClick={onStart} className="text-lg px-8 py-4">
        Configure a Provider <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
    </div>
  </div>
);

const ProviderSelectView = ({ allProviders, onSelect, onGenerate, isGenerating, disambiguationOptions, setDisambiguationOptions }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredProviders = Object.values(allProviders).filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Select an Identity Provider</h2>
        <p className="text-slate-600 mb-8">Choose the service you want to integrate with your application, or search for a new one.</p>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search providers (e.g. Slack, Stripe, Notion)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (disambiguationOptions) setDisambiguationOptions(null); // Clear suggestions when typing
            }}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-slate-900"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredProviders.map((provider) => {
          const Icon = typeof provider.icon === 'string' ? Server : provider.icon;
          return (
            <Card key={provider.id} onClick={() => onSelect(provider.id)} className="flex items-center gap-6 group hover:border-blue-200 hover:ring-1 hover:ring-blue-100">
              <div className="bg-slate-50 p-4 rounded-xl group-hover:bg-blue-50 transition-colors flex items-center justify-center">
                {typeof provider.icon === 'string' ? (
                  <span className="text-2xl font-bold text-slate-500">{provider.name.charAt(0)}</span>
                ) : (
                  <Icon className={`w-10 h-10 ${provider.color || 'text-slate-600'}`} />
                )}
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  {provider.name} 
                  {provider.isAiGenerated && <Sparkles className="w-3 h-3 text-amber-500" />}
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Configure {provider.name} OAuth 2.0 • <span className="font-medium text-slate-700">{provider.estimatedTime || '~10 mins'}</span>
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* AI Generation Prompt / Disambiguation Options */}
      {searchQuery && filteredProviders.length === 0 && (
        <div className="mt-8 text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-50 p-3 rounded-full">
              <SearchX className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          {disambiguationOptions ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Did you mean...</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                "{searchQuery}" is ambiguous and could refer to a few different services. Please choose the specific provider you want to configure:
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                {disambiguationOptions.map((opt, idx) => (
                  <Button 
                    key={idx} 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery(opt.searchHint);
                      onGenerate(opt.searchHint);
                    }}
                    disabled={isGenerating}
                    className="flex flex-col items-start px-4 py-3 h-auto border-blue-200 hover:bg-blue-50 hover:border-blue-300 w-full sm:w-64"
                  >
                    <span className="font-semibold text-blue-900">{opt.name}</span>
                    <span className="text-xs text-slate-500 text-left mt-1 line-clamp-2 w-full whitespace-normal">{opt.description}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">"{searchQuery}" not found</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                We don't have a pre-built guide for this provider yet. Our AI agent can research their official documentation and build one for you right now.
              </p>
              <Button 
                onClick={() => onGenerate(searchQuery)} 
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Researching {searchQuery}...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" /> Generate Guide for "{searchQuery}"
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const WizardView = ({ providerId, allProviders, onComplete, onBack }) => {
  const provider = allProviders[providerId];
  const [appType, setAppType] = useState('Web Application');
  const [environment, setEnvironment] = useState('development');

  const handleComplete = () => {
    onComplete({ appType, environment });
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <Button variant="ghost" onClick={onBack} className="mb-6 -ml-3">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to providers
      </Button>
      
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {typeof provider.icon === 'string' ? (
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-500">{provider.name.charAt(0)}</div>
            ) : (
              <provider.icon className={`w-6 h-6 ${provider.color || 'text-slate-600'}`} />
            )}
            <h2 className="text-2xl font-bold text-slate-900">Tailor your {provider.name} guide</h2>
          </div>
          <p className="text-slate-600">Tell us a bit about your implementation so we can provide accurate redirect URIs and environment-specific advice.</p>
        </div>

        <div className="space-y-6 mb-8">
          {/* App Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Application Type</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'Web Application', icon: Laptop },
                { id: 'Mobile / Native', icon: Smartphone },
                { id: 'Single Page App', icon: Terminal },
                { id: 'Backend Service', icon: Server },
              ].map((type) => (
                <div 
                  key={type.id}
                  onClick={() => setAppType(type.id)}
                  className={`cursor-pointer p-4 rounded-xl border flex items-center gap-3 transition-all ${
                    appType === type.id 
                      ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' 
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <type.icon className={`w-5 h-5 ${appType === type.id ? 'text-blue-500' : 'text-slate-400'}`} />
                  <span className="font-medium text-sm">{type.id}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Environment Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Environment</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'development', label: 'Local Development' },
                { id: 'production', label: 'Production / Public' }
              ].map((env) => (
                <div 
                  key={env.id}
                  onClick={() => setEnvironment(env.id)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all ${
                    environment === env.id 
                      ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' 
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="font-medium text-sm">{env.label}</div>
                  <div className="text-xs mt-1 opacity-70">
                    {env.id === 'development' ? 'Testing on localhost' : 'Live on a public domain'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <Button onClick={handleComplete} disabled={!appType || !environment} className="w-full sm:w-auto">
            Generate Setup Guide <Settings className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const GuideView = ({ providerId, wizardData, allProviders, onBack }) => {
  const provider = allProviders[providerId];
  const [completedSteps, setCompletedSteps] = useState(new Set());
  
  // AI Assistant State
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const toggleStep = (stepId) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const progress = Math.round((completedSteps.size / provider.steps.length) * 100);

  const handleAiTroubleshoot = async (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setIsAiLoading(true);
    setAiResponse('');
    
    try {
      const systemPrompt = `You are an expert OAuth troubleshooting assistant. The user is configuring ${provider.name} OAuth for a ${wizardData.appType} application in ${wizardData.environment}. They are encountering an error. Provide a concise, helpful, single-paragraph solution to their error. Do not ask for or output sensitive secrets like client_secret or tokens.`;
      
      const payload = {
        contents: [{ parts: [{ text: aiQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
      };
      
      // Using the environment API key format provided in the collaborative workspace
      const apiKey = ""; 
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        setAiResponse(text);
      } else {
        setAiResponse("Sorry, I couldn't generate a response. Please ensure you have a valid API key or try again.");
      }
    } catch (error) {
      setAiResponse("An error occurred while connecting to the AI assistant. Please try again later.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in slide-in-from-right-8 duration-300">
      <Button variant="ghost" onClick={onBack} className="mb-6 -ml-3">
        <ChevronLeft className="w-4 h-4 mr-1" /> Start Over
      </Button>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Main Content */}
        <div className="flex-1 space-y-8 w-full">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {typeof provider.icon === 'string' ? (
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-xl text-slate-500">{provider.name.charAt(0)}</div>
              ) : (
                <provider.icon className={`w-8 h-8 ${provider.color || 'text-slate-600'}`} />
              )}
              <h1 className="text-3xl font-bold text-slate-900">
                {provider.name} Setup Guide
                {provider.isAiGenerated && (
                  <span className="ml-3 text-xs align-middle bg-amber-100 text-amber-800 px-2 py-1 rounded-full font-medium inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Generated
                  </span>
                )}
              </h1>
            </div>
            <p className="text-slate-600">
              Customized for a <span className="font-semibold text-slate-800">{wizardData.appType}</span> application in <span className="font-semibold text-slate-800">{wizardData.environment}</span>.
            </p>
          </div>

          <Card className="bg-amber-50 border-amber-200">
            <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600" /> Prerequisites
            </h3>
            <ul className="list-disc list-inside text-sm text-amber-800 space-y-1 ml-1">
              {provider.prerequisites.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </Card>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-500" /> Configuration Steps
            </h2>
            <div className="space-y-4">
              {provider.steps.map((step, index) => {
                const isDone = completedSteps.has(step.id);
                return (
                  <div 
                    key={step.id} 
                    className={`p-5 rounded-xl border transition-all duration-200 flex gap-4 ${isDone ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-slate-300 shadow-sm'}`}
                  >
                    <button 
                      onClick={() => toggleStep(step.id)}
                      className="mt-0.5 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full h-6 w-6"
                    >
                      {isDone ? 
                        <CheckCircle2 className="w-6 h-6 text-green-500" /> : 
                        <Circle className="w-6 h-6 text-slate-300 hover:text-slate-400" />
                      }
                    </button>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className={`text-lg font-semibold ${isDone ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                          {index + 1}. {step.title}
                        </h3>
                        {step.estimatedTime && (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${isDone ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                            <Clock className="w-3 h-3" /> {step.estimatedTime}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${isDone ? 'text-slate-400' : 'text-slate-600'}`}>
                        {step.description}
                      </p>
                      
                      {step.isVerificationRequired && !isDone && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-900 flex items-start gap-2 border border-blue-100">
                          <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <p>{step.verificationNote}</p>
                        </div>
                      )}

                      {/* Contextual Injection based on Wizard Data */}
                      {step.title.includes('Redirect') && !isDone && (
                        <div className="mt-3 p-3 bg-slate-100 rounded-lg font-mono text-xs text-slate-800 border border-slate-200">
                          <div className="font-sans font-semibold text-slate-600 mb-1 text-[11px] uppercase tracking-wider">Suggested URI for {wizardData.environment}</div>
                          {wizardData.environment === 'development' 
                            ? 'http://localhost:3000/api/auth/callback/' + provider.id
                            : 'https://yourdomain.com/api/auth/callback/' + provider.id}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" /> Troubleshooting common errors
            </h2>
            <div className="grid gap-4 mb-6">
              {provider.troubleshooting.map((issue, idx) => (
                <Card key={idx} className="bg-red-50/50 border-red-100">
                  <h4 className="font-mono text-sm font-semibold text-red-900 mb-1">{issue.error}</h4>
                  <p className="text-sm text-red-800">{issue.solution}</p>
                </Card>
              ))}
            </div>

            {/* AI Troubleshooting Assistant */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-600" /> AI Troubleshooting Assistant
              </h3>
              <p className="text-sm text-blue-800 mb-4">
                Encountering a specific error not listed above? Describe it below and our AI will help you debug based on your {provider.name} setup.
              </p>
              
              <form onSubmit={handleAiTroubleshoot} className="flex gap-2">
                <input 
                  type="text" 
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="e.g., I'm getting 'Error 400: invalid_request'..."
                  className="flex-1 px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
                  disabled={isAiLoading}
                />
                <Button type="submit" disabled={isAiLoading || !aiQuery.trim()} className="bg-blue-600 hover:bg-blue-700">
                  {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ask AI'}
                </Button>
              </form>

              {aiResponse && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-blue-100 shadow-sm animate-in fade-in duration-300">
                  <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">AI Suggestion</div>
                  <p className="text-sm text-slate-700 leading-relaxed">{aiResponse}</p>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-72 flex-shrink-0 space-y-6 md:sticky md:top-6">
          <Card className="bg-slate-900 text-white border-none">
            <h3 className="font-semibold mb-2">Progress</h3>
            <div className="w-full bg-slate-700 rounded-full h-2.5 mb-2">
              <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-sm text-slate-300">{completedSteps.size} of {provider.steps.length} steps completed</p>
          </Card>

          <Card>
            <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider">Required Scopes</h3>
            <ul className="space-y-3">
              {provider.commonScopes.map((scope, idx) => (
                <li key={idx} className="text-sm">
                  <span className="font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-xs">{scope.name}</span>
                  <p className="text-slate-500 mt-1 text-xs">{scope.description}</p>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider">Fact Check</h3>
            <div className="text-xs text-slate-600 space-y-2">
              <p>Estimated time: <span className="font-semibold">{provider.estimatedTime || 'N/A'}</span></p>
              <p>Data last verified: <span className="font-semibold">{provider.lastVerified}</span></p>
              {provider.isAiGenerated && (
                <p className="text-amber-600 mb-2 border-l-2 border-amber-400 pl-2">
                  This guide was dynamically generated by AI by searching the web. Please verify details using the official docs.
                </p>
              )}
              <a href={provider.docsUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 break-words">
                Official Documentation <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // landing, provider-select, wizard, guide
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [wizardData, setWizardData] = useState(null);
  const [customProviders, setCustomProviders] = useState({});
  const [isGeneratingProvider, setIsGeneratingProvider] = useState(false);
  const [disambiguationOptions, setDisambiguationOptions] = useState(null);

  const allProviders = { ...PROVIDER_DATA, ...customProviders };

  const navigateTo = (view) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
  };

  // AI Agent to generate new provider configurations
  const handleGenerateProvider = async (providerName) => {
    setIsGeneratingProvider(true);
    setDisambiguationOptions(null);
    try {
      const apiKey = ""; 
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      
      const systemPrompt = `You are an expert developer assistant. The user wants to set up OAuth for a provider named "${providerName}".
      Research their official OAuth 2.0 developer documentation online. 
      CRITICAL INSTRUCTION: If the provider name "${providerName}" is ambiguous and could refer to multiple different tech companies or services (e.g., "Notion" could be the workspace app or a music software, "Apple" could be Sign in with Apple or Apple Music API), DO NOT guess. Set "isAmbiguous" to true and provide the top 2 suggestions in the "suggestions" array.
      If the name clearly refers to a single dominant tech platform (e.g., "Stripe", "Slack", "Sign in with Apple"), set "isAmbiguous" to false and generate the exact setup instructions in the "guide" object.`;

      const payload = {
        contents: [{ parts: [{ text: `Generate OAuth setup instructions for ${providerName}.` }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        tools: [{ "google_search": {} }], // Use Google Search for up-to-date documentation
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    "isAmbiguous": { "type": "BOOLEAN", "description": "True if the name could refer to multiple different identity providers." },
                    "suggestions": {
                        "type": "ARRAY",
                        "description": "If ambiguous, provide the top 2 possible matches.",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "name": { "type": "STRING", "description": "Company/Service name (e.g., Apple (Sign in with Apple))" },
                                "description": { "type": "STRING", "description": "Brief description of what this service is." },
                                "searchHint": { "type": "STRING", "description": "The exact specific name the user should use to retry the search (e.g., 'Sign in with Apple')." }
                            },
                            "required": ["name", "description", "searchHint"]
                        }
                    },
                    "guide": {
                        "type": "OBJECT",
                        "description": "The generated setup instructions. Omit or leave null if isAmbiguous is true.",
                        "properties": {
                            "id": { "type": "STRING", "description": "Lowercase string ID, e.g., slack, stripe" },
                            "name": { "type": "STRING", "description": "Proper display name" },
                            "docsUrl": { "type": "STRING", "description": "Valid URL to official OAuth docs" },
                            "estimatedTime": { "type": "STRING", "description": "Estimated time to complete, e.g., '15 mins'" },
                            "prerequisites": {
                                "type": "ARRAY",
                                "items": { "type": "STRING" }
                            },
                            "steps": {
                                "type": "ARRAY",
                                "items": {
                                    "type": "OBJECT",
                                    "properties": {
                                        "id": { "type": "STRING" },
                                        "title": { "type": "STRING" },
                                        "description": { "type": "STRING" },
                                        "isVerificationRequired": { "type": "BOOLEAN" },
                                        "verificationNote": { "type": "STRING", "description": "Only if verification is required" },
                                        "estimatedTime": { "type": "STRING", "description": "Estimated time to complete this specific step, e.g., '2 mins'" }
                                    },
                                    "required": ["id", "title", "description", "isVerificationRequired", "estimatedTime"]
                                }
                            },
                            "commonScopes": {
                                "type": "ARRAY",
                                "items": {
                                    "type": "OBJECT",
                                    "properties": {
                                        "name": { "type": "STRING" },
                                        "description": { "type": "STRING" }
                                    },
                                    "required": ["name", "description"]
                                }
                            },
                            "troubleshooting": {
                                "type": "ARRAY",
                                "items": {
                                    "type": "OBJECT",
                                    "properties": {
                                        "error": { "type": "STRING" },
                                        "solution": { "type": "STRING" }
                                    },
                                    "required": ["error", "solution"]
                                }
                            }
                        }
                    }
                },
                required: ["isAmbiguous"]
            }
        }
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (jsonText) {
        const generatedData = JSON.parse(jsonText);
        
        if (generatedData.isAmbiguous && generatedData.suggestions?.length > 0) {
          // Present options to the user instead of hallucinating
          setDisambiguationOptions(generatedData.suggestions);
        } else if (generatedData.guide) {
          // Success! Build the guide.
          const guide = generatedData.guide;
          guide.isAiGenerated = true;
          guide.lastVerified = new Date().toISOString().split('T')[0];
          guide.icon = 'Server'; // Fallback icon
          
          setCustomProviders(prev => ({
            ...prev,
            [guide.id]: guide
          }));

          setSelectedProvider(guide.id);
          navigateTo('wizard');
        } else {
          throw new Error("Invalid response format from AI.");
        }
      }
    } catch (error) {
      console.error("Failed to generate provider guide:", error);
      alert("Failed to research provider. Please try again.");
    } finally {
      setIsGeneratingProvider(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200">
      {/* Simple Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 font-bold text-xl cursor-pointer"
            onClick={() => navigateTo('landing')}
          >
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <span>OAuth Assistant</span>
          </div>
          <nav className="text-sm font-medium text-slate-500">
            v1.0 MVP
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pb-24">
        {currentView === 'landing' && (
          <LandingView onStart={() => navigateTo('provider-select')} />
        )}
        
        {currentView === 'provider-select' && (
          <ProviderSelectView 
            allProviders={allProviders}
            onSelect={(id) => {
              setSelectedProvider(id);
              navigateTo('wizard');
            }} 
            onGenerate={handleGenerateProvider}
            isGenerating={isGeneratingProvider}
            disambiguationOptions={disambiguationOptions}
            setDisambiguationOptions={setDisambiguationOptions}
          />
        )}

        {currentView === 'wizard' && selectedProvider && (
          <WizardView 
            providerId={selectedProvider} 
            allProviders={allProviders}
            onBack={() => navigateTo('provider-select')}
            onComplete={(data) => {
              setWizardData(data);
              navigateTo('guide');
            }}
          />
        )}

        {currentView === 'guide' && selectedProvider && wizardData && (
          <GuideView 
            providerId={selectedProvider}
            wizardData={wizardData}
            allProviders={allProviders}
            onBack={() => {
              setWizardData(null);
              navigateTo('provider-select');
            }}
          />
        )}
      </main>
    </div>
  );
}