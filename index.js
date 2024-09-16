#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectName = process.argv[2];

if (!projectName) {
  console.error('Please specify the project directory name:');
  console.log('  npx create-contemplate <project-directory>');
  process.exit(1);
}

const projectPath = path.join(process.cwd(), projectName);

if (fs.existsSync(projectPath)) {
  console.error(`The directory ${projectName} already exists.`);
  process.exit(1);
}

fs.mkdirSync(projectPath, { recursive: true });

const templatePath = path.join(__dirname, 'template');
fs.cpSync(templatePath, projectPath, { recursive: true });

console.log(`Project created in ${projectPath}`);

const htmlFilePath = path.join(projectPath, 'frontend', 'index.html');
let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
htmlContent = htmlContent.replace(/<title>Vite App<\/title>/, `<title>${projectName}</title>`);
fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');

const rootPackageJson = {
  name: projectName,
  version: "1.0.0",
  scripts: {
    "install-all": "npm install && cd frontend && npm install && cd ../backend && npm install",
    "start": "concurrently --kill-others --handle-input \"npm run backend\" \"npm run frontend\"",
    "backend": "cd backend && npm run dev",                     
    "frontend": "cd frontend && npm run dev",                  
    "build": "npm run build-backend && npm run build-frontend", 
    "build-backend": "cd backend && npm run build",            
    "build-frontend": "cd frontend && npm run build",           
    "start-production": "npm run build && npm run backend-production", 
    "backend-production": "cd backend && npm start"             
  },
  dependencies: {
    concurrently: "^6.2.1"
  }
};

fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(rootPackageJson, null, 2));

process.chdir(projectPath);

console.log('Installing dependencies...');
execSync('npm install', { stdio: 'inherit' });
execSync('cd frontend && npm install', { stdio: 'inherit' });
execSync('cd backend && npm install', { stdio: 'inherit' });

console.log('Project setup complete. Run the project with "npm start".');
