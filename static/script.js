document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const subjectInput = document.getElementById('subjectInput');  // 新增
    const chatContent = document.getElementById('chatContent');
    const convertBtn = document.getElementById('convertBtn');
    const loading = document.getElementById('loading');
    const resultSection = document.getElementById('resultSection');
    const latexResult = document.getElementById('latexResult');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    // 文件上传处理
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = function(e) {
                chatContent.value = e.target.result;
            };
            reader.readAsText(file);
        }
    });

    // 转换按钮点击
    convertBtn.addEventListener('click', async function() {
        const subject = subjectInput.value.trim();  // 新增
        const content = chatContent.value.trim();
        if (!subject || !content) {
            alert('请输入学习主题和聊天记录！');
            return;
        }

        // 显示加载状态
        loading.style.display = 'block';
        resultSection.style.display = 'none';
        convertBtn.disabled = true;
        convertBtn.textContent = '转换中...';

        try {
            const response = await fetch('/convert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ subject: subject, content: content })  // 修改：添加subject
            });

            const data = await response.json();

            if (response.ok) {
                // 显示结果
                latexResult.value = data.latex;
                resultSection.style.display = 'block';
                loading.style.display = 'none';
            } else {
                alert('转换失败: ' + data.error);
                loading.style.display = 'none';
            }
        } catch (error) {
            alert('转换失败: ' + error.message);
            loading.style.display = 'none';
        } finally {
            convertBtn.disabled = false;
            convertBtn.textContent = '转换为LaTeX';
        }
    });

    // 复制到剪贴板
    copyBtn.addEventListener('click', function() {
        latexResult.select();
        document.execCommand('copy');

        // 临时改变按钮文字
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '已复制！';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    });

    // 下载文件
    downloadBtn.addEventListener('click', function() {
        const content = latexResult.value;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ai_notes.tex';
        a.click();
        window.URL.revokeObjectURL(url);
    });
});