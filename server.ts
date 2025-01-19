const handler = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);

  if (url.pathname === '/api/images') {
    try {
      const page = url.searchParams.get('page') || '1';
      const query = url.searchParams.get('query') || 'ai';
      const per_page = url.searchParams.get('per_page') || '20';

      const response = await fetch(
        `https://unsplash.com/napi/search/photos?page=${page}&per_page=${per_page}&query=${query}`,
        {
          headers: {
            "Accept": "application/json",
          },
        }
      );

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "获取图片失败" }), 
        { 
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  } else if (url.pathname === '/') {
    try {
      const file = await Deno.readFile("index.html");
      return new Response(file, {
        headers: {
          "Content-Type": "text/html",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "无法读取 index.html 文件" }), 
        { 
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  }

  return new Response("Not Found", { status: 404 });
};

console.log("服务器运行在 http://localhost:8000");
Deno.serve({ port: 8000 }, handler);
