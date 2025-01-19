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
  }

  return new Response("Not Found", { status: 404 });
};

console.log("服务器运行在 http://localhost:8000");
Deno.serve({ port: 8000 }, handler);


// 初始加载时图片会被重叠放置在第一张图片上，过一会才会回到自己的正确位置上 这是因为图片加载和布局计算的时序问题么，在图片实际加载完成前，我们无法获得正确的图片尺寸，导致初始布局不准确。 将图片添加到 processedImages 之前，先预加载并获取尺寸
// 只有完全加载成功的图片才会被添加到布局中  添加加载状态标记，确保只处理已加载完成的图片
// 图片在添加到视图之前就已经获得了正确的尺寸
// 布局计算只在图片完全准备好后进行  @index.html  不使用批量加载，确保每个加载好的就直接显示出来


// 在实现瀑布流布局时，重排问题通常是由于列高不一致导致的。Pinterest 使用了一种称为“瀑布流布局”的技术，通过动态计算每列的高度来避免重排。我们可以通过以下方法来优化：