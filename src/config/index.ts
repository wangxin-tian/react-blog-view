const port = 3002;

export const requestBaseUrl = 
    process.env.NODE_ENV === 'development' 
    ? `http://${document.domain}:${port}` // 同源域名访问 118.195.140.233 192.168.137.1
    : `http://118.195.140.233:3002`;
