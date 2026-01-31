import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import base64
import boto3
import uuid

def handler(event: dict, context) -> dict:
    """API для управления портфолио работами"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            category = event.get('queryStringParameters', {}).get('category') if event.get('queryStringParameters') else None
            
            if category:
                cur.execute(
                    "SELECT id, title, category, image_url, description, created_at FROM portfolio_items WHERE category = %s ORDER BY created_at DESC",
                    (category,)
                )
            else:
                cur.execute(
                    "SELECT id, title, category, image_url, description, created_at FROM portfolio_items ORDER BY created_at DESC"
                )
            
            items = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps([dict(item) for item in items], default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            title = data.get('title')
            category = data.get('category')
            description = data.get('description', '')
            image_base64 = data.get('image')
            
            if not all([title, category, image_base64]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'}),
                    'isBase64Encoded': False
                }
            
            image_data = base64.b64decode(image_base64.split(',')[1] if ',' in image_base64 else image_base64)
            
            s3 = boto3.client('s3',
                endpoint_url='https://bucket.poehali.dev',
                aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
            )
            
            file_key = f'portfolio/{uuid.uuid4()}.jpg'
            s3.put_object(Bucket='files', Key=file_key, Body=image_data, ContentType='image/jpeg')
            
            image_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{file_key}"
            
            cur.execute(
                "INSERT INTO portfolio_items (title, category, image_url, description) VALUES (%s, %s, %s, %s) RETURNING id, title, category, image_url, description, created_at",
                (title, category, image_url, description)
            )
            conn.commit()
            
            new_item = cur.fetchone()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(dict(new_item), default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            item_id = event.get('queryStringParameters', {}).get('id') if event.get('queryStringParameters') else None
            
            if not item_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing id parameter'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("DELETE FROM portfolio_items WHERE id = %s RETURNING id", (item_id,))
            conn.commit()
            deleted = cur.fetchone()
            
            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Item not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'id': deleted['id']}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()
