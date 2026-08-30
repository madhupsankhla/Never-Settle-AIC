import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

export type SupportedLanguage =
  | 'en_IN'
  | 'en_US'
  | 'hi_IN'
  | 'mr_IN'
  | 'kn_IN'
  | 'zh_CN'
  | 'fr_FR'
  | 'es_ES'
  | 'de_DE';

export type SupportedCurrency = 'INR' | 'USD' | 'EUR' | 'GBP';
export type SupportedDateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
export type SupportedTimeZone = 'Asia/Kolkata' | 'UTC' | 'Europe/London' | 'America/New_York';

export interface RegionalConfig {
  language: SupportedLanguage;
  currency: SupportedCurrency;
  dateFormat: SupportedDateFormat;
  timeZone: SupportedTimeZone;
}

const DEFAULT_CONFIG: RegionalConfig = {
  language: 'en_IN',
  currency: 'INR',
  dateFormat: 'DD/MM/YYYY',
  timeZone: 'Asia/Kolkata',
};

// Comprehensive UI Translations dictionary for all 8 supported languages
const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en_IN: {
    overview: 'Overview',
    analytics: 'Trend & RCA',
    table_data: 'Data Grid',
    rca_insights: 'AI Causal Hub',
    settings: 'Settings',
    constraints: 'Constraints',
    help_docs: 'Help & Docs',
    conversion_rate: 'Conversion Rate',
    footfall: 'Footfall Traffic',
    revenue_at_risk: 'Revenue at Risk',
    return_rate: 'Size-Related Return Rate',
    filter: 'Filter',
    save: 'Save Settings',
    reset: 'Reset Defaults',
    search: 'Search SKU, Store, or Category...',
    language_region: 'Language & Region',
    greeting: 'Welcome back',
    system_status: 'All 8 stores reporting live telemetry',
    data_integration: 'Data Integration',
    notifications: 'Notifications',
    refresh: 'Refresh',
    copilot: 'AI Copilot & Feedback Engine',
    stage_funnel: '5-Stage Retail Footwear Conversion Funnel',
    by_product_category: 'By Product Category',
    by_region_network: 'By Region Network',
    share_of_volume: 'Share of Total Footwear Volume',
    root_cause_analysis: 'Root Cause Analysis',
    top_recommended_action: 'Top Recommended Action',
    estimated_weekly_recovery: 'Estimated Weekly Recovery',
    evidence_explorer: 'Evidence & Statistical Triangulation',
    data_grid_view: 'Interactive 6-Month Multi-Source Data Grid',
    export_csv: 'Export CSV',
    theme_mode: 'Theme Mode',
    accent_color: 'Accent Color',
    display_size: 'Display Size & Layout',
  },
  en_US: {
    overview: 'Overview',
    analytics: 'Trends & RCA',
    table_data: 'Data Grid',
    rca_insights: 'AI Causal Hub',
    settings: 'Settings',
    constraints: 'Constraints',
    help_docs: 'Help & Documentation',
    conversion_rate: 'Conversion Rate',
    footfall: 'Store Foot Traffic',
    revenue_at_risk: 'Revenue at Risk',
    return_rate: 'Size-Related Return Rate',
    filter: 'Filter',
    save: 'Save Settings',
    reset: 'Reset Defaults',
    search: 'Search SKU, Store, or Category...',
    language_region: 'Language & Region',
    greeting: 'Welcome back',
    system_status: 'All 8 retail locations reporting telemetry',
    data_integration: 'Data Ingestion',
    notifications: 'Notifications',
    refresh: 'Refresh',
    copilot: 'AI Copilot & Feedback Assistant',
    stage_funnel: '5-Stage Retail Conversion Funnel',
    by_product_category: 'By Product Category',
    by_region_network: 'By Region Network',
    share_of_volume: 'Share of Total Footwear Volume',
    root_cause_analysis: 'Root Cause Analysis',
    top_recommended_action: 'Top Recommended Action',
    estimated_weekly_recovery: 'Estimated Weekly Recovery',
    evidence_explorer: 'Evidence & Statistical Triangulation',
    data_grid_view: 'Interactive 6-Month Multi-Source Data Grid',
    export_csv: 'Export CSV',
    theme_mode: 'Theme Mode',
    accent_color: 'Accent Color',
    display_size: 'Display Size & Layout',
  },
  hi_IN: {
    overview: 'अवलोकन',
    analytics: 'ट्रेंड और कारण विश्लेषण',
    table_data: 'डेटा ग्रिड',
    rca_insights: 'एआई कारण हब',
    settings: 'सेटिंग्स',
    constraints: 'परिचालन सीमाएं',
    help_docs: 'सहायता व दस्तावेज़',
    conversion_rate: 'रूपांतरण दर',
    footfall: 'ग्राहकों की आवक',
    revenue_at_risk: 'जोखिम में राजस्व',
    return_rate: 'आकार संबंधित वापसी दर',
    filter: 'फ़िल्टर',
    save: 'सेटिंग्स सहेजें',
    reset: 'डिफ़ॉल्ट रीसेट करें',
    search: 'एसकेयू, स्टोर या श्रेणी खोजें...',
    language_region: 'भाषा और क्षेत्रीय प्रारूप',
    greeting: 'नमस्ते',
    system_status: 'सभी 8 स्टोर लाइव डेटा रिपोर्ट कर रहे हैं',
    data_integration: 'डेटा एकीकरण',
    notifications: 'सूचनाएं व अलर्ट',
    refresh: 'ताज़ा करें',
    copilot: 'एआई कोपायलट व फीडबैक',
    stage_funnel: '5-चरणीय फुटवियर रूपांतरण फ़नल',
    by_product_category: 'उत्पाद श्रेणी अनुसार',
    by_region_network: 'क्षेत्रीय नेटवर्क अनुसार',
    share_of_volume: 'कुल फुटवियर मात्रा में हिस्सेदारी',
    root_cause_analysis: 'मूल कारण विश्लेषण (RCA)',
    top_recommended_action: 'शीर्ष अनुशंसित कार्रवाई',
    estimated_weekly_recovery: 'अनुमानित साप्ताहिक पुनर्प्राप्ति',
    evidence_explorer: 'साक्ष्य और सांख्यिकीय सत्यापन',
    data_grid_view: 'इंटरएक्टिव 6-माह डेटा ग्रिड',
    export_csv: 'सीएसवी निर्यात करें',
    theme_mode: 'थीम मोड',
    accent_color: 'हाइलाइट रंग',
    display_size: 'डिस्प्ले फ़ॉन्ट और लेआउट',
  },
  mr_IN: {
    overview: 'विहंगावलोकन',
    analytics: 'कल व मूळ कारण विश्लेषण',
    table_data: 'डेटा ग्रिड',
    rca_insights: 'एआय कारण केंद्र',
    settings: 'सेटिंग्ज',
    constraints: 'कार्यप्रणाली मर्यादा',
    help_docs: 'मदत आणि माहिती',
    conversion_rate: 'रूपांतरण दर',
    footfall: 'ग्राहकांची ये-जा',
    revenue_at_risk: 'धोक्यात असलेला महसूल',
    return_rate: 'माप संबंधित परतावा दर',
    filter: 'फिल्टर',
    save: 'सेटिंग्ज जतन करा',
    reset: 'रीसेट करा',
    search: 'एसकेयू, दुकान किंवा प्रकार शोधा...',
    language_region: 'भाषा आणि प्रादेशिक स्वरूप',
    greeting: 'नमस्कार',
    system_status: 'सर्व 8 दुकाने थेट डेटा नोंदवत आहेत',
    data_integration: 'डेटा एकत्रीकरण',
    notifications: 'सूचना व इशारे',
    refresh: 'रीफ्रेश करा',
    copilot: 'एआय सहाय्यक आणि सल्ला',
    stage_funnel: '5-टप्प्यांची पादत्राणे रूपांतरण फनेल',
    by_product_category: 'उत्पादन वर्गवारीनुसार',
    by_region_network: 'प्रादेशिक विभागणीनुसार',
    share_of_volume: 'एकूण पादत्राणे विक्रीतील वाटा',
    root_cause_analysis: 'मूळ कारण विश्लेषण (RCA)',
    top_recommended_action: 'प्रमुख शिफारस केलेली कृती',
    estimated_weekly_recovery: 'अंदाजे साप्ताहिक पुनर्प्राप्ती',
    evidence_explorer: 'पुरावे आणि सांख्यिकीय पडताळणी',
    data_grid_view: 'परस्परसंवादी 6-महिन्यांचा डेटा ग्रिड',
    export_csv: 'सीएसव्ही निर्यात करा',
    theme_mode: 'रंगरूप मोड',
    accent_color: 'हायलाइट रंग',
    display_size: 'फॉन्ट आणि लेआउट आकार',
  },
  kn_IN: {
    overview: 'ಅವಲೋಕನ',
    analytics: 'ಟ್ರೆಂಡ್ ಮತ್ತು ಕಾರಣ ವಿಶ್ಲೇಷಣೆ',
    table_data: 'ಡೇಟಾ ಗ್ರಿಡ್',
    rca_insights: 'ಎಐ ಕಾರಣ ಕೇಂದ್ರ',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    constraints: 'ಕಾರ್ಯಾಚರಣೆ ನಿರ್ಬಂಧಗಳು',
    help_docs: 'ಸಹಾಯ ಮತ್ತು ದಾಖಲೆಗಳು',
    conversion_rate: 'ಪರಿವರ್ತನೆ ದರ',
    footfall: 'ಗ್ರಾಹಕರ ಸಂಚಾರ',
    revenue_at_risk: 'ಅಪಾಯದಲ್ಲಿರುವ ಆದಾಯ',
    return_rate: 'ಗಾತ್ರ ಸಂಬಂಧಿತ ಹಿಂತಿರುಗಿಸುವಿಕೆ',
    filter: 'ಫಿಲ್ಟರ್',
    save: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಉಳಿಸಿ',
    reset: 'ಮರುಹೊಂದಿಸಿ',
    search: 'ಎಸ್‌ಕೆಯು, ಅಂಗಡಿ ಅಥವಾ ವರ್ಗ ಹುಡುಕಿ...',
    language_region: 'ಭಾಷೆ ಮತ್ತು ಪ್ರದೇಶ',
    greeting: 'ನಮಸ್ಕಾರ',
    system_status: 'ಎಲ್ಲಾ 8 ಮಳಿಗೆಗಳು ಲೈವ್ ಡೇಟಾ ನೀಡುತ್ತಿವೆ',
    data_integration: 'ಡೇಟಾ ಸಂಯೋಜನೆ',
    notifications: 'ಅಧಿಸೂಚನೆಗಳು',
    refresh: 'ನವೀಕರಿಸಿ',
    copilot: 'ಎಐ ಸಹಾಯಕ ಮತ್ತು ಮಾರ್ಗದರ್ಶನ',
    stage_funnel: '5-ಹಂತದ ಪಾದರಕ್ಷೆ ಪರಿವರ್ತನೆ ಕೊಳವೆ',
    by_product_category: 'ಉತ್ಪನ್ನ ವರ್ಗದ ಪ್ರಕಾರ',
    by_region_network: 'ಪ್ರಾದೇಶಿಕ ನೆಟ್‌ವರ್ಕ್ ಪ್ರಕಾರ',
    share_of_volume: 'ಒಟ್ಟು ಪಾದರಕ್ಷೆಗಳ ಪ್ರಮಾಣದಲ್ಲಿ ಪಾಲು',
    root_cause_analysis: 'ಮೂಲ ಕಾರಣ ವಿಶ್ಲೇಷಣೆ (RCA)',
    top_recommended_action: 'ಉತ್ತಮ ಶಿಫಾರಸು ಕ್ರಮ',
    estimated_weekly_recovery: 'ಅಂದಾಜು ಸಾಪ್ತಾಹಿಕ ಚೇತರಿಕೆ',
    evidence_explorer: 'ಸಾಕ್ಷ್ಯ ಮತ್ತು ಸಂಖ್ಯಾಶಾಸ್ತ್ರೀಯ ಪರೀಕ್ಷೆ',
    data_grid_view: 'ಇಂಟರ್ಯಾಕ್ಟಿವ್ 6-ತಿಂಗಳ ಡೇಟಾ ಗ್ರಿಡ್',
    export_csv: 'ಸಿಎಸ್‌ವಿ ರಫ್ತು ಮಾಡಿ',
    theme_mode: 'ಥೀಮ್ ಮೋಡ್',
    accent_color: 'ಹೈಲೈಟ್ ಬಣ್ಣ',
    display_size: 'ಪ್ರದರ್ಶನ ಫಾಂಟ್ ಮತ್ತು ಲೇಔಟ್',
  },
  zh_CN: {
    overview: '总览 (Overview)',
    analytics: '趋势与根因分析 (Analytics)',
    table_data: '数据网格 (Data Grid)',
    rca_insights: 'AI 归因中心 (AI Hub)',
    settings: '系统设置 (Settings)',
    constraints: '业务约束条件 (Constraints)',
    help_docs: '帮助与文档 (Help & Docs)',
    conversion_rate: '进店转化率',
    footfall: '客流进店量',
    revenue_at_risk: '风险损失营收',
    return_rate: '尺码相关退货率',
    filter: '筛选过滤',
    save: '保存所有设置',
    reset: '恢复默认设置',
    search: '搜索商品、门店或品类...',
    language_region: '语言与区域偏好',
    greeting: '欢迎回来',
    system_status: '全部 8 家门店正在实时上报遥测数据',
    data_integration: '数据接入与整合',
    notifications: '业务预警与通知',
    refresh: '刷新数据',
    copilot: 'AI 智能副驾与反馈引擎',
    stage_funnel: '鞋类零售五阶段转化漏斗',
    by_product_category: '按商品品类划分',
    by_region_network: '按大区网络划分',
    share_of_volume: '鞋类总销量份额',
    root_cause_analysis: '归因诊断与根因分析 (RCA)',
    top_recommended_action: '首要推荐执行措施',
    estimated_weekly_recovery: '预计每周挽回营收',
    evidence_explorer: '多源证据与统计三角验证',
    data_grid_view: '交互式 6 个月多源数据网格',
    export_csv: '导出 CSV 数据',
    theme_mode: '外观主题模式',
    accent_color: '重点高亮色彩',
    display_size: '界面字号与间距密度',
  },
  fr_FR: {
    overview: 'Vue d’ensemble',
    analytics: 'Tendances & Diagnostic RCA',
    table_data: 'Grille de données',
    rca_insights: 'Pôle Causal IA',
    settings: 'Paramètres',
    constraints: 'Contraintes d’exploitation',
    help_docs: 'Aide & Documentation',
    conversion_rate: 'Taux de conversion',
    footfall: 'Trafic piétonnier en magasin',
    revenue_at_risk: 'Chiffre d’affaires à risque',
    return_rate: 'Taux de retour lié à la pointure',
    filter: 'Filtrer',
    save: 'Enregistrer les paramètres',
    reset: 'Rétablir les valeurs par défaut',
    search: 'Rechercher un article, magasin ou catégorie...',
    language_region: 'Langue & Région',
    greeting: 'Bienvenue',
    system_status: 'Les 8 magasins transmettent leurs données en direct',
    data_integration: 'Intégration des données',
    notifications: 'Notifications & Alertes',
    refresh: 'Actualiser',
    copilot: 'Copilote IA & Moteur d’apprentissage',
    stage_funnel: 'Entonnoir de conversion chaussures en 5 étapes',
    by_product_category: 'Par catégorie de produits',
    by_region_network: 'Par réseau régional',
    share_of_volume: 'Part du volume total de chaussures',
    root_cause_analysis: 'Analyse des causes profondes (RCA)',
    top_recommended_action: 'Action prioritaire recommandée',
    estimated_weekly_recovery: 'Récupération hebdomadaire estimée',
    evidence_explorer: 'Preuves & Triangulation statistique',
    data_grid_view: 'Grille de données interactive sur 6 mois',
    export_csv: 'Exporter en CSV',
    theme_mode: 'Mode de thème',
    accent_color: 'Couleur d’accentuation',
    display_size: 'Taille d’affichage & Densité',
  },
  es_ES: {
    overview: 'Visión General',
    analytics: 'Tendencias y Análisis Causal',
    table_data: 'Cuadrícula de Datos',
    rca_insights: 'Centro Causal de IA',
    settings: 'Configuración',
    constraints: 'Restricciones Operativas',
    help_docs: 'Ayuda y Documentación',
    conversion_rate: 'Tasa de Conversión',
    footfall: 'Tráfico de Clientes',
    revenue_at_risk: 'Ingresos en Riesgo',
    return_rate: 'Tasa de Devolución por Talla',
    filter: 'Filtrar',
    save: 'Guardar Configuración',
    reset: 'Restablecer Valores',
    search: 'Buscar SKU, tienda o categoría...',
    language_region: 'Idioma y Región',
    greeting: 'Bienvenido de nuevo',
    system_status: 'Las 8 tiendas están reportando telemetría en vivo',
    data_integration: 'Integración de Datos',
    notifications: 'Notificaciones y Alertas',
    refresh: 'Actualizar',
    copilot: 'Copiloto de IA y Retroalimentación',
    stage_funnel: 'Embudo de conversión de calzado en 5 etapas',
    by_product_category: 'Por Categoría de Producto',
    by_region_network: 'Por Red Regional',
    share_of_volume: 'Cuota del volumen total de calzado',
    root_cause_analysis: 'Análisis de Causa Raíz (RCA)',
    top_recommended_action: 'Acción Principal Recomendada',
    estimated_weekly_recovery: 'Recuperación Semanal Estimada',
    evidence_explorer: 'Evidencias y Triangulación Estadística',
    data_grid_view: 'Cuadrícula de datos interactiva de 6 meses',
    export_csv: 'Exportar CSV',
    theme_mode: 'Modo de Tema',
    accent_color: 'Color de Acento',
    display_size: 'Tamaño de Fuente y Diseño',
  },
  de_DE: {
    overview: 'Übersicht',
    analytics: 'Trends & Ursachenanalyse (RCA)',
    table_data: 'Datenraster',
    rca_insights: 'KI-Kausalitäts-Hub',
    settings: 'Einstellungen',
    constraints: 'Betriebliche Einschränkungen',
    help_docs: 'Hilfe & Dokumentation',
    conversion_rate: 'Konversionsrate',
    footfall: 'Kundenfrequenz',
    revenue_at_risk: 'Gefährdeter Umsatz',
    return_rate: 'Größenbedingte Rücksendequote',
    filter: 'Filtern',
    save: 'Einstellungen speichern',
    reset: 'Auf Standard zurücksetzen',
    search: 'Nach SKU, Filiale oder Kategorie suchen...',
    language_region: 'Sprache & Region',
    greeting: 'Willkommen zurück',
    system_status: 'Alle 8 Filialen übertragen Live-Telemetriedaten',
    data_integration: 'Datenintegration',
    notifications: 'Benachrichtigungen & Warnungen',
    refresh: 'Aktualisieren',
    copilot: 'KI-Copilot & Feedback-System',
    stage_funnel: '5-Stufen Schuh-Konversionstrichter',
    by_product_category: 'Nach Produktkategorie',
    by_region_network: 'Nach Regionalnetzwerk',
    share_of_volume: 'Anteil am gesamten Schuhvolumen',
    root_cause_analysis: 'Ursachenanalyse (RCA)',
    top_recommended_action: 'Dringend empfohlene Maßnahme',
    estimated_weekly_recovery: 'Geschätzte wöchentliche Rückgewinnung',
    evidence_explorer: 'Evidenz & Statistische Triangulation',
    data_grid_view: 'Interaktives 6-Monats-Datenraster',
    export_csv: 'CSV exportieren',
    theme_mode: 'Design-Modus',
    accent_color: 'Akzentfarbe',
    display_size: 'Schriftgröße & Layout-Dichte',
  },
};

// Phrase normalizer mapping for raw string translations
const PHRASE_MAPPINGS: Record<string, string> = {
  'overview': 'overview',
  'trend & rca': 'analytics',
  'trends & rca': 'analytics',
  'data grid': 'table_data',
  'ai causal hub': 'rca_insights',
  'settings': 'settings',
  'constraints': 'constraints',
  'help & docs': 'help_docs',
  'help & documentation': 'help_docs',
  'conversion rate': 'conversion_rate',
  'footfall traffic': 'footfall',
  'footfall': 'footfall',
  'revenue at risk': 'revenue_at_risk',
  'size-related return rate': 'return_rate',
  'return rate': 'return_rate',
  'filter': 'filter',
  'save settings': 'save',
  'reset defaults': 'reset',
  'language & region': 'language_region',
  'by product category': 'by_product_category',
  'by region network': 'by_region_network',
  'share of total footwear volume': 'share_of_volume',
  'root cause analysis': 'root_cause_analysis',
  'top recommended action': 'top_recommended_action',
  'estimated weekly recovery': 'estimated_weekly_recovery',
  'evidence & statistical triangulation': 'evidence_explorer',
  'theme mode': 'theme_mode',
  'accent color': 'accent_color',
  'display font & element size': 'display_size',
};

interface LocalizationContextType {
  config: RegionalConfig;
  setLanguage: (lang: SupportedLanguage) => void;
  setCurrency: (curr: SupportedCurrency) => void;
  setDateFormat: (fmt: SupportedDateFormat) => void;
  setTimeZone: (tz: SupportedTimeZone) => void;
  updateConfig: (newConfig: Partial<RegionalConfig>) => void;
  t: (keyOrPhrase: string, fallback?: string) => string;
  formatCurrency: (amountLakhsINR: number) => string;
  formatDate: (dateStr: string) => string;
  formatLiveTime: () => string;
  currencySymbol: string;
}

const LocalizationContext = createContext<LocalizationContextType | null>(null);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<RegionalConfig>(() => {
    try {
      const saved = localStorage.getItem('solesight_regional_config');
      if (saved) return JSON.parse(saved);
      const general = localStorage.getItem('solesight_general_settings');
      if (general) {
        const parsed = JSON.parse(general);
        return {
          language: parsed.language || 'en_IN',
          currency: parsed.currency || 'INR',
          dateFormat: parsed.dateFormat || 'DD/MM/YYYY',
          timeZone: parsed.timeZone || 'Asia/Kolkata',
        };
      }
    } catch {
      // ignore
    }
    return DEFAULT_CONFIG;
  });

  // Sync with document element & localStorage
  useEffect(() => {
    try {
      localStorage.setItem('solesight_regional_config', JSON.stringify(config));
    } catch (e) {
      console.error(e);
    }
    document.documentElement.lang = config.language;
    document.documentElement.dataset.currency = config.currency;
    document.documentElement.dataset.timezone = config.timeZone;
  }, [config]);

  const updateConfig = useCallback((newConfig: Partial<RegionalConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const setLanguage = useCallback((language: SupportedLanguage) => {
    updateConfig({ language });
  }, [updateConfig]);

  const setCurrency = useCallback((currency: SupportedCurrency) => {
    updateConfig({ currency });
  }, [updateConfig]);

  const setDateFormat = useCallback((dateFormat: SupportedDateFormat) => {
    updateConfig({ dateFormat });
  }, [updateConfig]);

  const setTimeZone = useCallback((timeZone: SupportedTimeZone) => {
    updateConfig({ timeZone });
  }, [updateConfig]);

  // Universal translation function: supports keys ('overview') or raw English strings ('Conversion Rate')
  const t = useCallback(
    (keyOrPhrase: string, fallback?: string): string => {
      if (!keyOrPhrase) return '';
      const langDict = TRANSLATIONS[config.language] || TRANSLATIONS.en_IN;

      // 1. Direct key match
      if (langDict[keyOrPhrase]) {
        return langDict[keyOrPhrase];
      }

      // 2. Normalized phrase lookup
      const normalized = keyOrPhrase.toLowerCase().trim();
      const mappedKey = PHRASE_MAPPINGS[normalized];
      if (mappedKey && langDict[mappedKey]) {
        return langDict[mappedKey];
      }

      return fallback || keyOrPhrase;
    },
    [config.language]
  );

  // Currency symbol
  const currencySymbol = useMemo(() => {
    switch (config.currency) {
      case 'INR':
        return '₹';
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      default:
        return '₹';
    }
  }, [config.currency]);

  // Format currency dynamically based on Lakhs INR input
  const formatCurrency = useCallback(
    (amountLakhsINR: number): string => {
      if (isNaN(amountLakhsINR)) return `${currencySymbol}0.0`;

      switch (config.currency) {
        case 'INR': {
          if (amountLakhsINR >= 100) {
            return `₹${(amountLakhsINR / 100).toFixed(2)} Cr`;
          }
          return `₹${amountLakhsINR.toFixed(1)}L`;
        }
        case 'USD': {
          // 1 Lakh INR approx $1,200 USD ($1.2K)
          const inUSD = amountLakhsINR * 1200;
          if (inUSD >= 1000000) {
            return `$${(inUSD / 1000000).toFixed(2)}M`;
          }
          if (inUSD >= 1000) {
            return `$${(inUSD / 1000).toFixed(1)}K`;
          }
          return `$${Math.round(inUSD).toLocaleString()}`;
        }
        case 'EUR': {
          // 1 Lakh INR approx €1,105 EUR
          const inEUR = amountLakhsINR * 1105;
          if (inEUR >= 1000000) {
            return `€${(inEUR / 1000000).toFixed(2)}M`;
          }
          if (inEUR >= 1000) {
            return `€${(inEUR / 1000).toFixed(1)}K`;
          }
          return `€${Math.round(inEUR).toLocaleString()}`;
        }
        case 'GBP': {
          // 1 Lakh INR approx £945 GBP
          const inGBP = amountLakhsINR * 945;
          if (inGBP >= 1000000) {
            return `£${(inGBP / 1000000).toFixed(2)}M`;
          }
          if (inGBP >= 1000) {
            return `£${(inGBP / 1000).toFixed(1)}K`;
          }
          return `£${Math.round(inGBP).toLocaleString()}`;
        }
        default: {
          return `₹${amountLakhsINR.toFixed(1)}L`;
        }
      }
    },
    [config.currency, currencySymbol]
  );

  // Format arbitrary date string (e.g. "2026-08-29") into chosen date format
  const formatDate = useCallback(
    (dateStr: string): string => {
      if (!dateStr) return '';
      try {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const [year, month, day] = parts;
          switch (config.dateFormat) {
            case 'DD/MM/YYYY':
              return `${day}/${month}/${year}`;
            case 'MM/DD/YYYY':
              return `${month}/${day}/${year}`;
            case 'YYYY-MM-DD':
              return `${year}-${month}-${day}`;
          }
        }
      } catch {
        // ignore
      }
      return dateStr;
    },
    [config.dateFormat]
  );

  // Format Live Time with selected TimeZone
  const formatLiveTime = useCallback((): string => {
    try {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: config.timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      const timeFormatter = new Intl.DateTimeFormat('en-US', options);
      const tzAbbr =
        config.timeZone === 'Asia/Kolkata'
          ? 'IST (UTC+05:30)'
          : config.timeZone === 'America/New_York'
          ? 'EDT (US)'
          : config.timeZone === 'Europe/London'
          ? 'BST (UK)'
          : 'UTC';
      return `${timeFormatter.format(now)} ${tzAbbr}`;
    } catch {
      return new Date().toLocaleTimeString();
    }
  }, [config.timeZone]);

  const value = useMemo(
    () => ({
      config,
      setLanguage,
      setCurrency,
      setDateFormat,
      setTimeZone,
      updateConfig,
      t,
      formatCurrency,
      formatDate,
      formatLiveTime,
      currencySymbol,
    }),
    [
      config,
      setLanguage,
      setCurrency,
      setDateFormat,
      setTimeZone,
      updateConfig,
      t,
      formatCurrency,
      formatDate,
      formatLiveTime,
      currencySymbol,
    ]
  );

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
