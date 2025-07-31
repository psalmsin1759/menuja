
export async function getAssemblyToken() { 
    const response = await fetch('/api/getAssemblyToken',  { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        cache: 'no-store', }
    ); 
    const responseBody = await response.json(); 
    const token = responseBody.token; 
    return token;
 }