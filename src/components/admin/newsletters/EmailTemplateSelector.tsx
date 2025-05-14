'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

type EmailTemplate = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  html: string;
};

// Example pre-made templates with Norse-inspired designs
const PRESET_TEMPLATES: EmailTemplate[] = [
  {
    id: 'norse-basic',
    name: 'Norse Basic',
    description: 'Clean layout with Nordic decoration and motifs',
    thumbnail: '/images/templates/norse-basic.png',
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Norse Newsletter</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #fafaf6; color: #1c1917;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <table align="center" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; margin: 30px auto; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <!-- Header with Norse design -->
                <tr>
                  <td style="background-color: #78350f; padding: 30px 20px; text-align: center;">
                    <h1 style="color: #c19a6b; margin: 0; font-size: 28px; letter-spacing: 1px;">{{title}}</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 30px 40px; line-height: 1.6;">
                    {{content}}
                  </td>
                </tr>
                <!-- Footer with runic design -->
                <tr>
                  <td style="background-color: #f5f5f4; padding: 20px; text-align: center; color: #78350f; border-top: 3px solid #c19a6b;">
                    <p>© {{year}} Odin Next. All rights reserved.</p>
                    <p><small>{{unsubscribe}}</small></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    `
  },
  {
    id: 'ragnarok-premium',
    name: 'Ragnarok Premium',
    description: 'Bold design with runes and Norse mythology elements',
    thumbnail: '/images/templates/ragnarok-premium.png',
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Ragnarok Newsletter</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #33292e; color: #fafaf6;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <table align="center" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #1c1917; border-radius: 8px; overflow: hidden; margin: 30px auto; box-shadow: 0 8px 20px rgba(0,0,0,0.2);">
                <!-- Header with Dramatic Norse design -->
                <tr>
                  <td style="background-color: #451a03; padding: 40px 20px; text-align: center; border-bottom: 4px solid #c19a6b;">
                    <h1 style="color: #c19a6b; margin: 0; font-size: 32px; letter-spacing: 2px; text-transform: uppercase;">{{title}}</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 40px; line-height: 1.7; color: #f0ebe5;">
                    {{content}}
                  </td>
                </tr>
                <!-- Call to action -->
                <tr>
                  <td style="padding: 0 40px 40px; text-align: center;">
                    <a href="{{cta_url}}" style="display: inline-block; padding: 12px 28px; background-color: #78350f; color: #c19a6b; text-decoration: none; font-weight: bold; border-radius: 4px; border: 2px solid #c19a6b; transition: background-color 0.3s;">{{cta_text}}</a>
                  </td>
                </tr>
                <!-- Footer with runic design -->
                <tr>
                  <td style="background-color: #451a03; padding: 20px; text-align: center; color: #c19a6b; border-top: 1px solid #c19a6b;">
                    <p>© {{year}} Odin Next. All rights reserved.</p>
                    <p><small>{{unsubscribe}}</small></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    `
  },
  {
    id: 'yggdrasil-elegant',
    name: 'Yggdrasil Elegant',
    description: 'Elegant design featuring the World Tree motif',
    thumbnail: '/images/templates/yggdrasil-elegant.png',
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Yggdrasil Newsletter</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #fafaf6; color: #1c1917;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <table align="center" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; margin: 30px auto; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e4e2df;">
                <!-- Header with elegant Norse design -->
                <tr>
                  <td style="padding: 30px 20px; text-align: center; border-bottom: 1px solid #c19a6b;">
                    <img src="{{logo_url}}" alt="Logo" width="120" style="margin-bottom: 20px;">
                    <h1 style="color: #78350f; margin: 0; font-size: 28px; letter-spacing: 1px;">{{title}}</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 40px; line-height: 1.6;">
                    {{content}}
                  </td>
                </tr>
                <!-- Featured Products -->
                <tr>
                  <td style="padding: 0 40px 40px;">
                    <h2 style="color: #78350f; border-bottom: 1px solid #c19a6b; padding-bottom: 10px;">{{featured_section_title}}</h2>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="33%" style="padding: 10px; text-align: center;">
                          <img src="{{product1_image}}" alt="Product 1" width="120" style="margin-bottom: 10px; border-radius: 4px;">
                          <p style="margin: 0; font-weight: bold;">{{product1_name}}</p>
                          <p style="margin: 5px 0;">{{product1_price}}</p>
                        </td>
                        <td width="33%" style="padding: 10px; text-align: center;">
                          <img src="{{product2_image}}" alt="Product 2" width="120" style="margin-bottom: 10px; border-radius: 4px;">
                          <p style="margin: 0; font-weight: bold;">{{product2_name}}</p>
                          <p style="margin: 5px 0;">{{product2_price}}</p>
                        </td>
                        <td width="33%" style="padding: 10px; text-align: center;">
                          <img src="{{product3_image}}" alt="Product 3" width="120" style="margin-bottom: 10px; border-radius: 4px;">
                          <p style="margin: 0; font-weight: bold;">{{product3_name}}</p>
                          <p style="margin: 5px 0;">{{product3_price}}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f5f5f4; padding: 20px; text-align: center; color: #78350f; border-top: 3px solid #c19a6b;">
                    <p>© {{year}} Odin Next. All rights reserved.</p>
                    <p><small>{{unsubscribe}}</small></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    `
  }
];

// Fallback images when templates don't have thumbnails
const DEFAULT_TEMPLATE_IMAGE = 'data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" width="300" height="150" viewBox="0 0 300 150" fill="none"%3e%3crect width="300" height="150" fill="%2378350f" /%3e%3cpath d="M50 75 L250 75" stroke="%23c19a6b" stroke-width="2"/%3e%3cpath d="M150 30 L150 120" stroke="%23c19a6b" stroke-width="2"/%3e%3ctext x="150" y="75" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="14" fill="%23ffffff"%3eEmail Template%3c/text%3e%3c/svg%3e';

interface EmailTemplateSelectorProps {
  onSelect: (template: EmailTemplate) => void;
  onCustom: () => void;
}

export default function EmailTemplateSelector({ onSelect, onCustom }: EmailTemplateSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Select an Email Template</h2>
        <button
          type="button"
          onClick={onCustom}
          className="btn bg-primary-600 hover:bg-primary-700 text-white"
        >
          Custom Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PRESET_TEMPLATES.map((template) => (
          <motion.div
            key={template.id}
            className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer bg-white"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            onClick={() => onSelect(template)}
          >
            <div className="relative w-full aspect-video bg-stone-100">
              <Image
                src={template.thumbnail || DEFAULT_TEMPLATE_IMAGE}
                alt={template.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = DEFAULT_TEMPLATE_IMAGE;
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg">{template.name}</h3>
              <p className="text-sm text-stone-600 mt-1">{template.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 