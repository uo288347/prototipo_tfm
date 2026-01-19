import { NoticeBar } from "antd-mobile"
import React, { forwardRef } from 'react';
import { useState, useEffect } from "react";
import { UtilsTasks, getTaskText } from "@/utils/UtilsTasks";
import { BulbOutlined } from "@ant-design/icons";
import confetti from 'canvas-confetti';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { registerComponent, COMPONENT_BANNER } from "@/metrics/script_v2";
import { getCurrentSceneId } from "@/metrics/constants/scenes";

export const InstructionsBanner = forwardRef((props, ref) => {
    const t = useTranslations();
    const router = useRouter();
    const locale = router.locale || 'es';
    const [currentTask, setCurrentTask] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [allCompleted, setAllCompleted] = useState(false);
    const [progress, setProgress] = useState({ completed: 0, total: 0 });

    // Función para registrar el banner en el sistema de métricas
    const registerBanner = (element) => {
        if (!element) return;

        const sceneId = getCurrentSceneId();
        if (sceneId === null) {
            console.warn(`[InstructionsBanner] No active scene for banner registration`);
            return;
        }

        const rect = element.getBoundingClientRect();
        registerComponent(
            sceneId,
            "instructions-banner",
            rect.left + window.scrollX,
            rect.top + window.scrollY,
            rect.right + window.scrollX,
            rect.bottom + window.scrollY,
            COMPONENT_BANNER,
            null
        );
    };

    // Función para lanzar confeti
    const playSuccessSound = () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    };

    // Función para lanzar confeti desde el banner
    const launchConfetti = (bannerElement) => {
        if (!bannerElement) return;

        const rect = bannerElement.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height;

        confetti({
            particleCount: 100,
            spread: 80,
            origin: {
                x: x / window.innerWidth,
                y: y / window.innerHeight
            },
        });
    };
    // Actualizar la tarea actual
    const updateCurrentTask = () => {
        const task = UtilsTasks.getCurrentTask();
        const completedTasks = UtilsTasks.tasks.filter(t =>
            UtilsTasks.isTaskCompleted(t.storageKey)
        ).length;
        const totalTasks = UtilsTasks.tasks.length;

        setProgress({ completed: completedTasks, total: totalTasks });

        if (!task) {
            setAllCompleted(true);
            setCurrentTask(null);
        } else {
            setAllCompleted(false);
            setCurrentTask(task);
        }
    };

    // Escuchar cambios en las tareas
    useEffect(() => {
        updateCurrentTask();

        const handleTaskCompleted = () => {
            setIsSuccess(true);
            playSuccessSound();
            setTimeout(() => {
                if (ref?.current) {
                    launchConfetti(ref.current);
                }
            }, 50);

            setTimeout(() => {
                setIsSuccess(false);
                updateCurrentTask();
            }, 3000);
        };

        window.addEventListener('taskCompleted', handleTaskCompleted);

        return () => {
            window.removeEventListener('taskCompleted', handleTaskCompleted);
        };
    }, []);

    // Registrar el banner en el sistema de métricas
    useEffect(() => {
        const timer = setTimeout(() => {
            if (ref?.current) {
                registerBanner(ref.current);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [currentTask, allCompleted]);

    if (allCompleted) {
        return (
            <div ref={ref} style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
            }}>
                <NoticeBar
                    icon={<BulbOutlined />}
                    content={t('instructions.allTasksCompleted')}
                    color="success"
                />
            </div>
        );
    }

    if (!currentTask) {
        return null;
    }

    const progressText = `${progress.completed + 1}/${progress.total}`;

    return (
        <div ref={ref} style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
        }}>
            <NoticeBar
                icon={
                    isSuccess 
                        ? <BulbOutlined />
                        : <><BulbOutlined /><span style={{fontSize: '1rem', marginLeft: '8px'}}>{progressText}</span></>
                }
                content={
                    isSuccess
                        ? t('instructions.taskCompleted')
                        : `${getTaskText(currentTask.id, locale)}`
                }
                color={isSuccess ? "success" : "info"}
                style={{
                    backgroundColor: isSuccess ? '#d5ffcc' : '#a7d4ff',
                    color: isSuccess ? '#1f5c00' : '#003c74',
                }}
            />

            <div style={{
                width: '100%',
                height: '3px',
                backgroundColor: '#e0e0e0',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${(progress.completed / progress.total) * 100}%`,
                    height: '100%',
                    backgroundColor: isSuccess ? '#1f5c00' : '#005aae',
                    transition: 'width 0.5s ease-in-out'
                }} />
            </div>
        </div>
    );
})