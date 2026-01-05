import React, { useState, useCallback, useMemo } from 'react';
import PhaserGame from './PhaserGame';

const SpritesheetDemo: React.FC = () => {
    // Sử dụng Type cho useState
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [frameWidth, setFrameWidth] = useState<number>(32);
    const [frameHeight, setFrameHeight] = useState<number>(32);
    const [isReady, setIsReady] = useState<boolean>(false);

    // Xử lý khi chọn file
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        if (selectedFile) {
            setFile(selectedFile);
            setIsReady(false);
            
            // Hủy URL cũ nếu có trước khi tạo cái mới
            if (imageUrl) URL.revokeObjectURL(imageUrl);
            setImageUrl(null);
        }
    };

    // Xử lý khi nhấn nút Run
    const handleRunDemo = useCallback(() => {
        if (file && frameWidth > 0 && frameHeight > 0) {
            // Tạo URL tạm thời cho ảnh đã tải lên
            const url = URL.createObjectURL(file);
            setImageUrl(url);
            setIsReady(true);
        } else {
            alert('Vui lòng tải ảnh và nhập kích thước frame hợp lệ!');
        }
    }, [file, frameWidth, frameHeight]);
    
    // Kiểm tra điều kiện để kích hoạt nút Run
    const canRun = useMemo(() => file !== null && frameWidth > 0 && frameHeight > 0, [file, frameWidth, frameHeight]);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>🛠️ Spritesheet Demo Tool (React TS + Phaser)</h2>

            {/* --- KHU VỰC ĐIỀU KHIỂN (UI) --- */}
            <div style={{ marginBottom: '20px', border: '1px solid #eee', padding: '15px', borderRadius: '5px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        **1. Tải lên Spritesheet (.png, .jpg):**
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            style={{ marginLeft: '10px' }}
                        />
                    </label>
                    {file && <p style={{ margin: '5px 0 0', fontSize: '0.9em' }}>File đã chọn: **{file.name}**</p>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'inline-block', marginRight: '20px' }}>
                        **2. Chiều rộng Frame (px):**
                        <input 
                            type="number" 
                            value={frameWidth} 
                            onChange={(e) => setFrameWidth(Number(e.target.value))} 
                            min="1" 
                            required
                            style={{ width: '80px', marginLeft: '5px' }}
                        />
                    </label>
                    <label>
                        **Chiều cao Frame (px):**
                        <input 
                            type="number" 
                            value={frameHeight} 
                            onChange={(e) => setFrameHeight(Number(e.target.value))} 
                            min="1" 
                            required
                            style={{ width: '80px', marginLeft: '5px' }}
                        />
                    </label>
                </div>

                <button 
                    onClick={handleRunDemo}
                    style={{ 
                        padding: '10px 20px', 
                        backgroundColor: canRun ? '#007bff' : '#ccc', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px',
                        cursor: canRun ? 'pointer' : 'not-allowed'
                    }}
                    disabled={!canRun}
                >
                    ▶️ Run Demo
                </button>
            </div>

            {/* --- KHU VỰC GAME PHASER --- */}
            <h3>🕹️ Khu Vực Demo Phaser</h3>
            {/* Chỉ render PhaserGame khi isReady VÀ imageUrl đã là string (non-null) */}
            {isReady && typeof imageUrl === 'string' ? (
                <PhaserGame
                    // Type assertion không cần thiết vì chúng ta đã kiểm tra type ở trên
                    imageUrl={imageUrl} 
                    frameWidth={frameWidth}
                    frameHeight={frameHeight}
                    isReady={isReady}
                />
            ) : (
                <div style={{ 
                    width: '800px', 
                    height: '600px', 
                    margin: '20px auto', 
                    border: '2px dashed #999',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f0f0f0',
                    color: '#666'
                }}>
                    Tải ảnh, nhập kích thước frame và nhấn Run để bắt đầu!
                </div>
            )}
        </div>
    );
};

export default SpritesheetDemo;