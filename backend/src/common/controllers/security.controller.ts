import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Request } from 'express';

@ApiTags('security')
@Controller('security')
export class SecurityController {
    @Get('csrf-token')
    @ApiOperation({ summary: 'Get CSRF token' })
    @ApiResponse({
        status: 200,
        description: 'CSRF token retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                csrfToken: { type: 'string' },
            },
        },
    })
    getCsrfToken(@Req() req: Request) {
        return {
            csrfToken: req.csrfToken(),
        };
    }
}
