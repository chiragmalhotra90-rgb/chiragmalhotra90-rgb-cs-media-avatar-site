/*
 * CS Media Creative Knowledge Library
 *
 * Data only: the website and the future desktop widget can consume the same
 * category/resource manifest without copying URLs or availability notes.
 * `status` is intentionally explicit for links whose original service moved
 * or closed. Mobbin appears twice because it belongs in both source lists.
 */
(function (root) {
  'use strict';

  root.CSKnowledgeResources = {
    version: 1,
    updated: '2026-08-21',
    categories: [
      {
        id: 'design-inspiration',
        name: 'Design Inspiration',
        description: 'Find visual direction, references and standout web work.',
        resources: [
          { id: 'behance', name: 'Behance', url: 'https://www.behance.net/' },
          { id: 'dribbble', name: 'Dribbble', url: 'https://dribbble.com/' },
          { id: 'awwwards', name: 'Awwwards', url: 'https://www.awwwards.com/' },
          { id: 'land-book', name: 'Land-book', url: 'https://land-book.com/' },
          { id: 'siteinspire', name: 'SiteInspire', url: 'https://www.siteinspire.com/' },
          { id: 'mobbin-design', name: 'Mobbin', url: 'https://mobbin.com/' },
          { id: 'godly', name: 'Godly', url: 'https://godly.design/' },
          { id: 'lapa-ninja', name: 'Lapa Ninja', url: 'https://www.lapa.ninja/' },
          { id: 'designspiration', name: 'Designspiration', url: 'https://www.designspiration.com/' },
          { id: 'pinterest', name: 'Pinterest', url: 'https://www.pinterest.com/' }
        ]
      },
      {
        id: 'ui-ux-resources',
        name: 'UI/UX Resources',
        description: 'Research patterns, product flows and production-ready UI assets.',
        resources: [
          { id: 'mobbin-uiux', name: 'Mobbin', url: 'https://mobbin.com/' },
          { id: 'ui8', name: 'UI8', url: 'https://ui8.net/' },
          { id: 'refero', name: 'Refero', url: 'https://refero.design/' },
          { id: 'screenlane', name: 'Screenlane', url: 'https://screenlane.com/' },
          { id: 'ux-archive', name: 'UX Archive', url: 'https://uxarchive.com/', status: 'unavailable', note: 'Original site is currently unavailable or unstable' },
          { id: 'pttrns', name: 'Pttrns', url: 'https://www.pttrns.com/' },
          { id: 'page-flows', name: 'Page Flows', url: 'https://pageflows.com/' },
          { id: 'saas-landing-page', name: 'SaaS Landing Page', url: 'https://saaslandingpage.com/' },
          { id: 'collect-ui', name: 'Collect UI', url: 'https://collectui.com/' },
          { id: 'ui-garage', name: 'UI Garage', url: 'https://www.uigarage.net/', status: 'archived', note: 'Closed archive; no longer updated' }
        ]
      },
      {
        id: 'textures-materials',
        name: 'Textures & Materials',
        description: 'Source production textures, surfaces and scan-based materials.',
        resources: [
          { id: 'poly-haven', name: 'Poly Haven', url: 'https://polyhaven.com/' },
          { id: 'ambientcg', name: 'ambientCG', url: 'https://ambientcg.com/' },
          { id: 'cgbookcase', name: 'CGBookcase', url: 'https://www.cgbookcase.com/' },
          { id: 'textures-com', name: 'Textures.com', url: 'https://www.textures.com/' },
          { id: '3dtextures-me', name: '3DTextures.me', url: 'https://3dtextures.me/' },
          { id: 'sharetextures', name: 'ShareTextures', url: 'https://www.sharetextures.com/' },
          { id: 'texture-ninja', name: 'Texture Ninja', url: 'https://texture.ninja/' },
          { id: 'quixel-megascans-fab', name: 'Quixel Megascans / Fab', url: 'https://www.fab.com/sellers/Quixel%20Megascans', status: 'moved', note: 'Megascans library moved to Fab' },
          { id: 'poliigon', name: 'Poliigon', url: 'https://www.poliigon.com/' },
          { id: 'arroway-textures', name: 'Arroway Textures', url: 'https://www.arroway-textures.ch/' }
        ]
      },
      {
        id: 'colors-palettes',
        name: 'Colors & Palettes',
        description: 'Build palettes, validate combinations and explore color systems.',
        resources: [
          { id: 'coolors', name: 'Coolors', url: 'https://coolors.co/' },
          { id: 'color-hunt', name: 'Color Hunt', url: 'https://colorhunt.co/' },
          { id: 'adobe-color', name: 'Adobe Color', url: 'https://color.adobe.com/' },
          { id: 'happy-hues', name: 'Happy Hues', url: 'https://www.happyhues.co/' },
          { id: 'muzli-colors', name: 'Muzli Colors', url: 'https://colors.muz.li/' },
          { id: 'eva-colors', name: 'Eva Colors', url: 'https://colors.eva.design/' },
          { id: 'pigment-shapefactory', name: 'Pigment by ShapeFactory', url: 'https://pigment.shapefactory.co/' },
          { id: 'khroma', name: 'Khroma', url: 'https://www.khroma.co/' },
          { id: 'colorspace', name: 'ColorSpace', url: 'https://mycolor.space/' },
          { id: 'material-theme-builder', name: 'Material Theme Builder', url: 'https://m3.material.io/theme-builder' }
        ]
      },
      {
        id: 'ai-tools-designers',
        name: 'AI Tools for Designers',
        description: 'Move from concept to image, video, voice and interface faster.',
        resources: [
          { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com/' },
          { id: 'midjourney', name: 'Midjourney', url: 'https://www.midjourney.com/' },
          { id: 'adobe-firefly', name: 'Adobe Firefly', url: 'https://firefly.adobe.com/' },
          { id: 'ideogram', name: 'Ideogram', url: 'https://ideogram.ai/' },
          { id: 'runway', name: 'Runway', url: 'https://runway.com/', actions: [
            { name: 'Open workspace', url: 'https://app.runwayml.com/' }
          ] },
          { id: 'kling-ai', name: 'Kling AI', url: 'https://klingai.com/' },
          { id: 'leonardo-ai', name: 'Leonardo AI', url: 'https://leonardo.ai/', actions: [
            { name: 'Open workspace', url: 'https://app.leonardo.ai/' }
          ] },
          { id: 'relume', name: 'Relume', url: 'https://www.relume.ai/' },
          { id: 'uizard', name: 'Uizard', url: 'https://uizard.io/' },
          { id: 'canva-ai', name: 'Canva AI', url: 'https://www.canva.com/canva-ai/' },
          { id: 'elevenlabs', name: 'ElevenLabs', url: 'https://elevenlabs.io/', featured: true, actions: [
            { name: 'Text to Speech', url: 'https://elevenlabs.io/app/speech-synthesis/text-to-speech' },
            { name: 'Speech to Text', url: 'https://elevenlabs.io/app/speech-to-text' },
            { name: 'Voice Changer', url: 'https://elevenlabs.io/app/speech-synthesis/speech-to-speech' },
            { name: 'Dubbing', url: 'https://elevenlabs.io/app/dubbing' },
            { name: 'Studio', url: 'https://elevenlabs.io/app/studio' }
          ] }
        ]
      }
    ]
  };
}(window));
