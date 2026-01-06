// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

// Định nghĩa Interface (Types) cho Props
interface PhaserGameProps {
    imageUrl: string | null;
    frameWidth: number;
    frameHeight: number;
    isReady: boolean;
}

const PhaserGame: React.FC<PhaserGameProps> = ({ imageUrl, frameWidth, frameHeight, isReady }) => {
    const gameContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Chỉ tiếp tục nếu:
        // 1. Đã sẵn sàng (isReady = true)
        // 2. imageUrl là một string hợp lệ (Non-null)
        // 3. Kích thước frame hợp lệ
        // 4. Có container DOM để gắn game vào
        if (!isReady || typeof imageUrl !== 'string' || frameWidth <= 0 || frameHeight <= 0 || !gameContainerRef.current) {
            // Nếu imageUrl là null, chúng ta dừng ở đây.
            return () => {
                // Đảm bảo URL cũ (nếu có) bị hủy khi deps thay đổi
                if (typeof imageUrl === 'string') {
                    URL.revokeObjectURL(imageUrl);
                }
            };
        }

        // --- CẤU HÌNH GAME PHASER VỚI TS ---
        class DemoScene extends Phaser.Scene {
            constructor() {
                super('DemoScene');
            }

            // Tải tài nguyên: Ảnh spritesheet
            preload() {
                // Trong scope này, imageUrl chắc chắn là 'string', an toàn cho Phaser API
                this.load.spritesheet('demoSprite', imageUrl, {
                    frameWidth: frameWidth,
                    frameHeight: frameHeight
                });
            }

            // Tạo đối tượng và animation
            create() {
                const texture = this.textures.get('demoSprite');
                
                // Kiểm tra an toàn
                if (texture.key === '__MISSING' || !texture.getFrameNames) {
                    console.error('Lỗi: Texture không tải được hoặc không tìm thấy frame. Kiểm tra lại kích thước.');
                    return;
                }
                
                const totalFrames = texture.getFrameNames().length;
                
                if (totalFrames === 0) {
                     console.error('Không tìm thấy frame nào. Kiểm tra frameWidth/frameHeight có đúng không.');
                     return;
                }

                // 1. Tạo animation
                this.anims.create({
                    key: 'walk',
                    frames: this.anims.generateFrameNumbers('demoSprite', { start: 0, end: totalFrames - 1 }),
                    frameRate: 10,
                    repeat: -1
                });

                // 2. Thêm sprite vào giữa màn hình
                // Sử dụng sys.game.canvas để lấy kích thước chính xác từ config
                const { width, height } = this.sys.game.canvas;
                const sprite = this.add.sprite(
                    width / 2,
                    height / 2,
                    'demoSprite'
                );

                // 3. Chỉnh scale
                sprite.setScale(1);

                // 4. Chạy animation
                sprite.play('walk');
            }
        }

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent : "show",
            scale: {
                 mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            orientation: Phaser.Scale.LANDSCAPE,
            },
            backgroundColor: '#2d2d2d',
            parent: gameContainerRef.current,
            scene: DemoScene
        };

        // Khởi tạo game
        const game = new Phaser.Game(config);

        // --- Cleanup khi component unmount hoặc dependency thay đổi ---
        return () => {
            game.destroy(true); 
            // Hủy Object URL khi game instance bị hủy
            if (typeof imageUrl === 'string') {
                 URL.revokeObjectURL(imageUrl);
            }
        };

    }, [isReady, imageUrl, frameWidth, frameHeight]);

    return (
        <div 
            ref={gameContainerRef} 
            style={{ 
                width: frameWidth , 
                height: frameHeight, 
                margin: '20px auto', 
                border: '1px solid #ccc',
                overflow: 'hidden' 
            }}
        >
            {/* Phaser Canvas sẽ được thêm vào đây */}
        </div>
    );
};

export default PhaserGame;